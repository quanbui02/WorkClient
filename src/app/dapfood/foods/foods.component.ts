import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { FoodsEditComponent } from './foods-edit/foods-edit.component';
import { FoodsService } from '../services/foods.service';
import { UserService } from '../../lib-shared/services/user.service';
import { BannercategoriesService } from '../services/bannercategories.service';

@Component({
    selector: 'app-foods',
    templateUrl: './foods.component.html',
    styleUrls: ['./foods.component.scss']
})
export class FoodsComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        isActive: -1,
        idCate: -1
    };
    active_options: any[];
    cate_options: any[];
    productInput: any = { KhoId: '-1', SaleId: '-1' };

    @ViewChild(FoodsEditComponent) _foodsEditComponent: FoodsEditComponent;

    constructor(
        protected _injector: Injector,
        private _foodsService: FoodsService,
        private _UserService: UserService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.loadTableColumnConfig();
        await this.loadActiveOptions();
        await this.getData();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'image',
                header: 'Hình ảnh',
                visible: true,
                align: 'center',
                sort: true,
            },
            {
                field: 'name',
                header: 'Tên',
                visible: true,
                sort: true
            },
            {
                field: 'description',
                header: 'Mô tả',
                visible: true,
                sort: true
            },
            {
                field: 'sort',
                header: 'Thứ tự',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'showFromDate',
                header: 'Thời gian hiển thị',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true
            }
            // ,
            // {
            //     field: 'isShowHome',
            //     header: 'Mobile',
            //     visible: true,
            //     align: 'center',
            //     width: '10%',
            //     sort: true
            // }
        ];
    }

    async loadActiveOptions() {
        this.active_options = [{ label: '-- Trạng thái --', value: -1 }];
        this.active_options.push({ label: 'Không sử dụng', value: 0 });
        this.active_options.push({ label: 'Sử dụng', value: 1 });
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._foodsService.Gets(
            this.searchModel.key,
            this.searchModel.idCate,
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
        this._foodsEditComponent.showPopup(id);
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
            this._foodsService.delete(id).then(re => {
                if (re.status) {
                    this._notifierService.showDeleteDataSuccess();
                    this.dataSource = this.dataSource.filter(obj => obj.id !== id);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    onActive(item: any, e) {
        const obj = {
            id: item.id,
            isActived: e.checked
        };
        this._foodsService.Active(obj).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    onShowHome(item: any, e) {
        const obj = {
            id: item.id,
            isShowHome: e.checked
        };
        this._foodsService.IsShowHome(obj).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
            } else {
                this._notifierService.showError(rs.message);
            }
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
