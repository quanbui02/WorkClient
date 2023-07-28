import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../lib-shared/services/user.service';
import { BrandsService } from '../services/brands.service';
import { FaqsService } from '../services/faqs.service';
import { BrandEditComponent } from './brand-edit/brand-edit.component';

@Component({
    selector: 'app-brand',
    templateUrl: './brand.component.html',
    styleUrls: ['./brand.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BrandComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        isActive: -1,
        type: -1
    };
    active_options: any[];
    productInput: any = { KhoId: '-1', SaleId: '-1' };

    @ViewChild(BrandEditComponent) _BrandEditComponent: BrandEditComponent;

    constructor(
        protected _injector: Injector,
        private _BrandsService: BrandsService
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
                width: '10%',
                sort: true,
            },
            {
                field: 'name',
                header: 'Tên',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'totalProducts',
                header: 'Số sản phẩm',
                visible: true,
                align: 'center',
                width: '10%',
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

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._BrandsService.Gets(
            this.searchModel.key,
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
        this._BrandEditComponent.showPopup(id);
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
            this._BrandsService.delete(id).then(re => {
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
            isActive: e.checked
        };
        this._BrandsService.Active(obj).then(rs => {
            this._notifierService.showSuccess(rs.message);
        });
    }

    onShowHome(item: any, e) {
        const obj = {
            id: item.id,
            isShowHome: e.checked
        };
        this._BrandsService.ShowHome(obj).then(rs => {
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
