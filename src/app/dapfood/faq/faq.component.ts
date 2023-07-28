import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../lib-shared/services/user.service';
import { FaqEditComponent } from './faq-edit/faq-edit.component';
import { FaqsService } from '../services/faqs.service';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FaqComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        type: -1
    };
    type_options: any[];
    productInput: any = { KhoId: '-1', SaleId: '-1' };

    @ViewChild(FaqEditComponent) _FaqEditComponent: FaqEditComponent;

    constructor(
        protected _injector: Injector,
        private _FaqsService: FaqsService,
        private _UserService: UserService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.loadTableColumnConfig();
        await this.loadCate();
        await this.getData();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'type',
                header: 'Loại',
                visible: true,
                align: 'center',
                width: '15%',
                sort: true
            },
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
                field: 'description',
                header: 'Mô tả',
                visible: true,
                sort: true
            },
            {
                field: 'urlVideo',
                header: 'urlVideo',
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

    async loadCate() {
        this.type_options = [{ label: '-- Loại hướng dẫn --', value: -1 }];
        this.type_options.push({ label: 'Hướng dẫn bán hàng', value: 1 });
        this.type_options.push({ label: 'Hướng dẫn sử dụng', value: 2 });
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._FaqsService.Gets(
            this.searchModel.key,
            this.searchModel.type,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField
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
        this._FaqEditComponent.showPopup(id);
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
            this._FaqsService.delete(id).then(re => {
                if (re.status) {
                    this.dataSource = this.dataSource.filter(obj => obj.id !== id);
                    this._notifierService.showSuccess(rs.message);
                }
                else
                    this._notifierService.showError(re.message);
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
        this._FaqsService.Active(obj).then(rs => {
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
