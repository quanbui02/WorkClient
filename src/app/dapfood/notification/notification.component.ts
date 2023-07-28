import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { NotificationsService } from '../services/notifications.service';
import { NotificationEditComponent } from './notification-edit/notification-edit.component';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NotificationComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        type: -1,
        isSent: -1
    };
    type_options: any[];
    productInput: any = { KhoId: '-1', SaleId: '-1' };

    @ViewChild(NotificationEditComponent) _NotificationEditComponent: NotificationEditComponent;

    constructor(
        protected _injector: Injector,
        private _NotificationsService: NotificationsService
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
            // {
            //     field: 'code',
            //     header: 'Mã',
            //     visible: true,
            //     align: 'center',
            //     width: '10%',
            //     sort: true
            // },
            {
                field: 'type',
                header: 'Loại',
                visible: true,
                align: 'center',
                width: '8%',
                sort: true
            },
            {
                field: 'sendTo',
                header: 'Người nhận',
                visible: true,
                align: 'center',
                width: '8%',
                sort: true
            },
            {
                field: 'title',
                header: 'Tiêu đề',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'content',
                header: 'Nội dung',
                visible: true,
                sort: true
            },
            {
                field: 'isSent',
                header: 'Đã gửi',
                visible: true,
                align: 'center',
                width: '8%',
                sort: true
            },
            {
                field: 'sentDate',
                header: 'Ngày gửi',
                visible: true,
                align: 'left',
                width: '8%',
                sort: true
            },
            {
                field: 'sentUser',
                header: 'Người gửi',
                visible: true,
                align: 'left',
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
        await this._NotificationsService.Gets(
            this.searchModel.key, this.searchModel.type, this.searchModel.isSent,
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
        this._NotificationEditComponent.showPopup(id);
    }
    onSend(id: number) {
        this._notifierService.showConfirm('Bạn có chắc chắn muốn gửi thông báo này', 'Gửi thông báo').then(rs => {
            this._NotificationsService.SendNotification(id).then(re => {
                if (re.status) {
                    this.getData();
                    this._notifierService.showSuccess('Gửi thông báo thành công');
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }
    onDelete(id: number) {
        this._notifierService.showConfirm('Bạn có chắc muốn xóa bản ghi này?', 'Xóa bản ghi?').then(rs => {
            this._NotificationsService.delete(id).then(re => {
                if (re.status) {
                    this._notifierService.showDeleteDataSuccess();
                    this.dataSource = this.dataSource.filter(obj => obj.id !== id);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    // onActive(item: any, e) {
    //     const obj = {
    //         id: item.id,
    //         isActive: e
    //     };
    //     this._NotificationsService.Active(obj).then(rs => {
    //         if (rs.status) {
    //             this._notifierService.showSuccess('Cập nhật thành công');
    //         } else {
    //             this._notifierService.showError(rs.message);
    //         }
    //     });
    // }

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
