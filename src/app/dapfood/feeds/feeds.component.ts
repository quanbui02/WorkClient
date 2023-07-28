
import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { FeedsService } from '../services/feeds.service';
import { FeedsEditComponent } from './feeds-edit/feeds-edit.component';

@Component({
    selector: 'app-feeds',
    templateUrl: './feeds.component.html',
    styleUrls: ['./feeds.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeedsComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        isActived: -1,
        pin: -1,
        type: -1
    };
    active_options: any[];
    pin_options: any[];

    @ViewChild(FeedsEditComponent) _FeedsEditComponent: FeedsEditComponent;

    constructor(
        protected _injector: Injector,
        private _FeedsService: FeedsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.cols = [
            {
                field: 'user',
                header: 'Tác giả',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'content',
                header: 'Nội dung',
                visible: true,
                sort: true
            },
            {
                field: 'product',
                header: 'Sản phẩm',
                visible: true,
                width: '15%',
                sort: true
            },
            {
                field: 'like',
                header: 'Like',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true
            },
            {
                field: 'comment',
                header: 'Comment',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true
            },
            {
                field: 'isActived',
                header: 'Trạng thái',
                visible: true,
                align: 'center',
                width: '120px',
                sort: true
            },
            {
                field: 'createdDate',
                header: 'CreatedDate',
                visible: true,
                align: 'center',
                width: '120px',
                sort: true
            },
            {
                field: 'sort',
                header: 'Thứ tự',
                visible: true,
                align: 'center',
                width: '80px',
                sort: true
            },
        ];
        await this.loadActiveOptions();
        await this.loadPinOptions();
        await this.getData();
    }

    async loadActiveOptions() {
        this.active_options = [{ label: '-- Trạng thái --', value: -1 }];
        this.active_options.push({ label: 'Không sử dụng', value: 0 });
        this.active_options.push({ label: 'Sử dụng', value: 1 });
    }

    async loadPinOptions() {
        this.pin_options = [{ label: '-- Ghim --', value: -1 }];
        this.pin_options.push({ label: 'Không ghim', value: 0 });
        this.pin_options.push({ label: 'Đang ghim', value: 1 });
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._FeedsService.List(
            this.searchModel.key,
            this.searchModel.isActived,
            this.searchModel.pin,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        }).catch(error => {
            this.isLoading = false;
            this._notifierService.showResponseError(error);
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    onSearch() {
        this.getData();
    }

    onEdit(id: any) {
        this._FeedsEditComponent.showPopup(id);
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Xóa bản ghi ?', 'Bạn có chắc muốn xóa bản ghi này ?').then(rs => {
            this._FeedsService.onDeleteAdmin(id).then(re => {
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
            isActived: e.checked
        };
        this._FeedsService.Active(obj).then(rs => {
            if (rs.status) {
                item.isActived = e.checked;
                this._notifierService.showSuccess(rs.message);
            }
            else
                this._notifierService.showError(rs.message);
        }).catch(error => {
            this._notifierService.showResponseError(error);
        });
    }

    onPin(item: any, e) {
        const obj = {
            id: item.id,
            Pin: e.checked
        };
        this._FeedsService.Pin(obj).then(rs => {
            if (rs.status) {
                item.pin = e.checked;
                this._notifierService.showSuccess(rs.message);
            }
            else
                this._notifierService.showError(rs.message);
        }).catch(error => {
            this._notifierService.showResponseError(error);
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

