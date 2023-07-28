import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { PromotionUsersService } from '../services/promotionUsers.service';
import { PromotionUsersEditComponent } from './promotionUser-edit/promotionUser-edit.component';
import { PromotionUserUserUsedComponent } from './promotionUser-UserUsed/promotionUser-UserUsed.component';
import { PromotionUserGiftcodeComponent } from './promotionUser-Giftcode/promotionUser-Giftcode.component';
import { PromotionUserAccumulationComponent } from './promotionUser-accumulation/promotionUser-accumulation.component';
@Component({
    selector: 'app-promotionUser',
    templateUrl: './promotionUser.component.html',
    styleUrls: ['./promotionUser.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PromotionUsersComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        isActive: -1,
        type: -1
    };
    type_options = [];
    active_options: any[];
    productInput: any = { KhoId: '-1', SaleId: '-1' };
    @ViewChild(PromotionUsersEditComponent) _PromotionUserEditComponent: PromotionUsersEditComponent;
    @ViewChild(PromotionUserUserUsedComponent) _promotionUserUserUsedComponent: PromotionUserUserUsedComponent;
    @ViewChild(PromotionUserGiftcodeComponent) _promotionUserGiftcodeComponent: PromotionUserGiftcodeComponent;
    @ViewChild(PromotionUserAccumulationComponent) _promotionUserAccumulationComponent: PromotionUserAccumulationComponent;

    constructor(
        protected _injector: Injector,
        private _PromotionUsersService: PromotionUsersService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.loadTableColumnConfig();
        await this.loadActiveOptions();
        await this.getData();
        await this.loadType();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'name',
                header: 'Tên',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'type',
                header: 'Hình thức khuyến mãi',
                visible: true,
                width: '10%',
            },
            {
                field: 'startDate',
                header: 'Từ ngày',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'endDate',
                header: 'Đến ngày',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'quantity',
                header: 'Số lượng',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'mode',
                header: 'Loại',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true
            },
            {
                field: 'sale',
                header: 'Giá trị',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'sort',
                header: 'Thứ tự',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true
            },
            {
                field: 'isActive',
                header: 'Trạng thái',
                visible: true,
                align: 'center',
                width: '8%',
                sort: true
            }
        ];
    }

    async loadActiveOptions() {
        this.active_options = [{ label: '-- Trạng thái --', value: -1 }];
        this.active_options.push({ label: 'Không sử dụng', value: 0 });
        this.active_options.push({ label: 'Sử dụng', value: 1 });
    }

    async loadType() {
        this.type_options = [{ label: '-- Hình thức khuyến mãi --', value: -1 }];
        this.type_options.push({ label: 'Khuyến mãi theo tổng tiền đơn', value: 1 });
        this.type_options.push({ label: 'Khuyến mãi theo sản phẩm', value: 2 });
        this.type_options.push({ label: 'Khuyến mãi phí ship', value: 5 });
        this.type_options.push({ label: 'Khuyến mãi giới thiệu', value: 6 });
        this.type_options.push({ label: 'Khuyến mãi Code', value: 3 });
        this.type_options.push({ label: 'Khuyến mãi tích lũy', value: 7 });
        // this.type_options.push({ label: 'Giảm giá trực tiếp', value: 4 });
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._PromotionUsersService.Gets(
            this.searchModel.key,
            this.searchModel.type,
            this.searchModel.isActive,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    onSearch() {
        this.getData();
    }

    onEdit(id: any) {
        this._PromotionUserEditComponent.showPopup(id);
    }

    onShowUsed(id: any, mode: any) {
        this._promotionUserUserUsedComponent.showPopup2(id, mode);
    }

    onShowGiftcode(id: any) {
        this._promotionUserGiftcodeComponent.showPopup(id);
    }

    onShowAccumulation(id: any) {
        this._promotionUserAccumulationComponent.showPopup(id);
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Xóa bản ghi ?', 'Bạn có chắc muốn xóa bản ghi này ?').then(rs => {
            this._PromotionUsersService.deleteAll(id).then(re => {
                if (re.status) {
                    this.dataSource = this.dataSource.filter(obj => obj.id !== id);
                    this._notifierService.showSuccess(rs.message);
                }
                else
                    this._notifierService.showError("Chương trình đã chạy nên không thể xóa !");
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    onActive(item: any, e) {
        const obj = {
            id: item.id,
            isActive: e.checked
        };
        this._PromotionUsersService.Active(obj).then(rs => {
            this._notifierService.showSuccess(rs.message);
        });
    }

    toggleSearch() {
        super.toggleSearch();
        this.fixTableScrollProblem();
    }
    onChangeRowLimit() {
        this.fixTableScrollProblem();
    }
    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    fixTableScrollProblem() {
        this.dataSource = [...this.dataSource];
    }
    onCloseForm() {
        this.getData();
    }
}
