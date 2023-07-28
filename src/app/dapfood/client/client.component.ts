import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ClientEditComponent } from './edit/client-edit.component';
import { ClientsService } from '../services/clients.service';
import { UsersClientComponent } from '../client/users-client/users-client.component';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClientComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: ''
    };
    colFilter: any = {};
    sms_options: any[];
    ClientInput: any = { KhoId: '-1', SaleId: '-1' };

    @ViewChild(ClientEditComponent) _ClientEdit: ClientEditComponent;
    @ViewChild(UsersClientComponent) _UsersClientComponent: UsersClientComponent;


    constructor(
        protected _injector: Injector,
        private _ClientService: ClientsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        await this.loadSms();
        await this.getData();
        this.loadTableColumnConfig();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'name',
                header: 'Tên doanh nghiệp',
                visible: true,
                width: '20%',
                sort: true,
            }, {
                field: 'userName',
                header: 'Tài khoản',
                visible: true,
                width: '10%',
                sort: true,
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'email',
                header: 'Email',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'address',
                header: 'Địa chỉ',
                visible: true,
                width: '30%',
                sort: true
            },
            {
                field: 'isSendSms',
                header: 'Tin nhắn',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true
            }
        ];
    }

    async loadSms() {
        this.sms_options = [];
        this.sms_options.push({ label: 'Không kích hoạt', value: false });
        this.sms_options.push({ label: 'Đã kích hoạt', value: true });
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        this.colFilter.tenDot = [];
        await this._ClientService.Gets(
            this.searchModel.key,
            this.searchModel.isSendSms,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
                rs.data.forEach(item => {
                    this.colFilter.tenDot.push({
                        label: item.tenDot,
                        value: item.tenDot
                    });
                });
            }
        });
        console.log(159, this.dataSource.values);
        this.resetBulkSelect();
        this.isLoading = false;
    }

    onActive(item: any, e) {
        const obj = {
            id: item.id,
            isActived: e.checked
        };
        this._ClientService.Active(obj).then(rs => {
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

    onSearch() {
        this.getData();
    }
    onEdit(id: any) {
        this._ClientEdit.showPopup(id);
    }
    onList(id: any) {
        this._UsersClientComponent.showPopup(id);
    }
    onSynClient() {
        this.resetBulkSelect();
    }

    onThietLap() {
    }
    onDelete(item: any) {
        this._notifierService.showConfirm('Bạn có chắc muốn xóa doanh nghiệp này?', 'Xóa doanh nghiệp').then(rs => {
            item.isDeleted = true;
            item.isActived = false;
            this._ClientService.post(item).then(re => {
                if (re.status) {
                    this._notifierService.showDeleteDataSuccess();
                    this.getData();
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
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
