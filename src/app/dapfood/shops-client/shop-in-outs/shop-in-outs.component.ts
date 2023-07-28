import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../lib-shared/models/user';
import { UserService } from '../../../lib-shared/services/user.service';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';
import TimeAgo from 'javascript-time-ago'
import vi from 'javascript-time-ago/locale/vi.json'
import { ShopInOutsService } from '../../services/shopInOuts.service';
import { ShopInOutsEditComponent } from './shop-in-outs-edit/shop-in-outs-edit.component';

@Component({
    selector: 'app-shop-in-outs',
    templateUrl: './shop-in-outs.component.html',
    styleUrls: ['./shop-in-outs.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShopInOutsComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        idProduct: -1,
        type: -1,
        status: -1,
    };
    status_options = [];
    actions_options = [];
    listOrdersPrint: any[] = [];
    orderType_options = [];
    colFilter: any = {};
    disabled = false;
    ref: DynamicDialogRef;
    crrUser: User;
    vi: any;
    timeAgo: any;

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        public dialogService: DialogService,
        private activatedRoute: ActivatedRoute,
        private _UserService: UserService,
        private _shopInOutsService: ShopInOutsService,
    ) {
        super(null, _injector);
    }

    @ViewChild(ShopInOutsEditComponent) _shopInOutsEditComponent: ShopInOutsEditComponent;

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.crrUser = await this._UserService.getCurrentUser();

        TimeAgo.addDefaultLocale(vi);
        this.timeAgo = new TimeAgo('vi-VN');
        this.cols = [
            {
                field: 'id',
                header: 'Mã',
                visible: false,
                align: 'center',
                width: '2%',
                sort: true,
            },
            {
                field: 'code',
                header: 'Mã đơn',
                visible: true,
                align: 'center',
                width: '40px',
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                dataType: 'date',
                align: 'center',
                sort: true,
            },
            {
                field: 'UserCreated',
                header: 'CTV',
                visible: false,
            },
            {
                field: 'name',
                header: 'Tên đơn',
                visible: true,
            },
            {
                field: 'idInOutStatus',
                header: 'Trạng thái',
                visible: true,
                align: 'center',
            },
            {
                field: 'nameShopOperation',
                header: 'Loại',
                visible: true,
                align: 'center',
            }
        ];
        await this.loadType();
        await this.loadStatus();
        await this.activatedRoute.params.map(params => [params['key'], params['idProduct'], params['fromDate'], params['toDate']]).subscribe(async ([key, idProduct, fromDate, toDate]) => {
            if (idProduct) {
                this.searchModel.idProduct = idProduct;
            }

            if (key) {
                this.searchModel.key = key;
            }
        });

        await this.getData();
    }

    async loadStatus() {
        this.status_options.push({ label: '-- Trạng thái --', value: -1 });
        this.status_options.push({ label: 'Mới tạo', value: 1 });
        this.status_options.push({ label: 'Gửi đơn', value: 2 });
        this.status_options.push({ label: 'Chấp nhận', value: 3 });
        this.status_options.push({ label: 'Hủy đơn', value: 4 });
        this.status_options.push({ label: 'Vận chuyển', value: 5 });
        this.status_options.push({ label: 'Hoàn thành', value: 6 });
    }

    async loadType() {
        this.orderType_options.push({ label: '-- Loại đơn --', value: -1 });
        this.orderType_options.push({ label: 'Nhập kho', value: 1 });
        this.orderType_options.push({ label: 'Xuất kho', value: 2 });
    }

    async onPrintOrder() {
        this.isLoading = true;
        let lstId = this.ids.toString();
        await this._shopInOutsService.GetDetailPrint(lstId).then(async response => {
            this.listOrdersPrint = response.data;
        }, error => {
            this._notifierService.showHttpUnknowError();
        });

        setTimeout(() => {
            this.isLoading = false;
            var divsToPrint = document.getElementById('pagePrint');
            var newWin = window.open('', 'win');
            newWin.document.write(divsToPrint.innerHTML);
            newWin.location.reload();
            newWin.focus();
            newWin.print();
            newWin.close();
        }, 3000);
    }

    onCheckAll() {
        if (this.ids.length < this.dataSource.length) {
            this.isCheckAll = true;
            this.ids = [];
            for (let i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].checked = true;
                this.ids.push(this.dataSource[i].id);
            }
        } else {
            this.isCheckAll = false;
            this.ids = [];
            for (let i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].checked = false;
            }
        }
        this.isMultiEdit = this.ids.length > 0 ? true : false;
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }


    formatDate(date: string) {
        var myDate = new Date(date);
        return myDate.getTime();
    }

    getTimeAgo(date: string) {
        if (date !== null && date.length > 0 && date !== '0001-01-01T00:00:00Z')
            return this.timeAgo.format(this.formatDate(date.replace('T', ' ').replace('Z', '')))
    }

    onAdd() {
        // this._orderAdd.showPopup(0);
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._shopInOutsService.Gets(
            this.searchModel.key,
            this.searchModel.idProduct,
            this.searchModel.type,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            (this.isAsc ? 1 : 0),
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

    onEdit(id: any) {
        this._shopInOutsEditComponent.showPopup(id);
    }

    // onViewHistory(item: any) {
    //     this._OrderHistory.showPopup(item);
    // }

    getNameStatus(id) {
        if (id && id > 0) {
            var status = this.status_options.filter(d => d.value === id);
            if (status != null && status.length > 0) {
                return status[0].label;
            }
        }
    }

    async onCloseForm(item: any) {
        await this.UpdateDataSource(item);
    }

    async UpdateDataSource(item: any) {
        if (item) {
            if (item.isDeleted && item.isDeleted == true) {
                this.dataSource.splice(this.dataSource.indexOf(item), 1);
            } else {
                const index = this.dataSource.findIndex(s => s.id === item.id);
                await this._shopInOutsService.Gets(item.id, -1, -1, null, null, 0, 1, '', 0).then(rs => {
                    if (rs.status) {
                        if (index >= 0) {
                            let checked = this.dataSource[index].checked;
                            rs.data[0].checked = checked;
                            this.dataSource[index] = rs.data[0];
                        } else {
                            this.dataSource.unshift(rs.data[0]);
                        }
                    }
                });
            }
        }
    }


    onUpdateOrderStatus(item) {
        // let ids = '';
        // if (this.dataSource != null) {
        //     ids = this.dataSource.map((obj) => obj.id).toString();
        // }
        // this.ref = this.dialogService.open(OrderStatusUpdateComponent, {
        //     data: {
        //         idOrder: item.id,
        //         idStatus: item.idStatus,
        //     },
        //     header: 'Cập nhật trạng thái đơn hàng',
        //     width: '70%',
        //     styleClass: "vs-modal",
        //     contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
        //     baseZIndex: 1001,

        // });

        // this.ref.onClose.subscribe((re: any) => {
        //     if (re != null) {
        //         this.UpdateDataSource(item);
        //         this.isLoading = false;
        //     }
        // });
    }


}
