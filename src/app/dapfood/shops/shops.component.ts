import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ShopsEditComponent } from './edit/shops-edit.component';
import { ShopsService } from '../services/shops.service';
import { UsersShopComponent } from '../shops/users-shop/users-shop.component';
import { ProvincesService } from '../services/provinces.service';
import { ClientsService } from '../services/clients.service'
@Component({
    selector: 'app-shops',
    templateUrl: './shops.component.html',
    styleUrls: ['./shops.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShopsComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        idProvince: -1,
        idClient: -1
    };
    colFilter: any = {};
    province_options: any[];
    client_options: any[];
    @ViewChild(ShopsEditComponent) _ShopsEdit: ShopsEditComponent;
    @ViewChild(UsersShopComponent) _UsersShopComponent: UsersShopComponent;


    constructor(
        protected _injector: Injector,
        private _ShopsService: ShopsService,
        private _ProvincesService: ProvincesService,
        private _ClientsService: ClientsService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        await this.onLoadProvinces();
        await this.onLoadClients();
        await this.getData();
        this.loadTableColumnConfig();
    }

    async onLoadProvinces() {
        this.province_options = [{ label: '-- Tỉnh/TP --', value: -1 }];
        await this._ProvincesService.GetShort().then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.province_options.push({ label: item.label, value: item.value });
                });
            }
        });
    }

    async onLoadClients() {
        this.client_options = [{ label: '-- Doanh nghiệp --', value: -1 }];
        await this._ClientsService.GetShort('').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.client_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'code',
                header: 'Mã',
                visible: true,
                sort: true,
                width: '5%',
            },
            {
                field: 'name',
                header: 'Tên cửa hàng',
                visible: true,
                width: '20%',
            },
            {
                field: 'fullAddress',
                header: 'Địa chỉ',
                width: '20%',
                visible: true,
            },
            {
                field: 'userName',
                header: 'Tài khoản',
                visible: true,
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
                visible: true,
            }
            // ,
            // {
            //     field: 'isOpen',
            //     header: 'Nhận đơn',
            //     visible: true,
            //     width: '3%',
            // }
            // ,
            // {
            //     field: 'isShopBabi',
            //     header: 'Shop Babi',
            //     visible: true,
            //     width: '3%',
            // }
        ];
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._ShopsService.Gets(
            this.searchModel.key,
            this.searchModel.idProvince,
            this.searchModel.idClient,
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

    onActive(item: any, e) {
        this._notifierService.showConfirm('Bạn có chắc muốn thay đổi kích hoạt cửa hàng này ?', 'Cập nhật').then(rs => {
            const obj = {
                id: item.id,
                isActived: e.checked
            };
            this._ShopsService.Active(obj).then(rs => {
                if (rs.status) {
                    item.isActived = e.checked;
                    this._notifierService.showSuccess(rs.message);
                }
                else
                    this._notifierService.showError(rs.message);
            }).catch(error => {
                this._notifierService.showResponseError(error);
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    onShow(item: any, e) {
        this._notifierService.showConfirm('Bạn có chắc muốn thay đổi hiển thị cửa hàng này ?', 'Cập nhật').then(rs => {
            const obj = {
                id: item.id,
                isShow: e.checked
            };
            this._ShopsService.Show(obj).then(rs => {
                if (rs.status) {
                    item.isShow = e.checked;
                    this._notifierService.showSuccess(rs.message);
                }
                else
                    this._notifierService.showError(rs.message);
            }).catch(error => {
                this._notifierService.showResponseError(error);
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    onOpen(item: any, e) {
        this._notifierService.showConfirm('Bạn có chắc muốn thay đổi Có thể tiếp nhận đơn cửa hàng này ?', 'Cập nhật').then(rs => {
            const obj = {
                id: item.id,
                isOpen: e.checked
            };
            this._ShopsService.Open(obj).then(rs => {
                if (rs.status) {
                    item.isOpen = e.checked;
                    this._notifierService.showSuccess(rs.message);
                }
                else
                    this._notifierService.showError(rs.message);
            }).catch(error => {
                this._notifierService.showResponseError(error);
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    onSearch() {
        this.getData();
    }
    onEdit(id: any) {
        this._ShopsEdit.showPopup(id);
    }
    onList(id: any) {
        this._UsersShopComponent.showPopup(id);
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
            this._ShopsService.post(item).then(re => {
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
