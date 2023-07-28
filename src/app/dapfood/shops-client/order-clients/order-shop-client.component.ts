import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { StatusService } from '../../services/status.service';
import { ActionsService } from '../../services/actions.service';
import { User } from '../../../lib-shared/models/user';
import { UserService } from '../../../lib-shared/services/user.service';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
// import { OrderHistoryComponent } from '../../ctv/orders/order-history/order-history.component';
import { OrderEditComponent } from '../../ctv/orders/order-edit/order-edit.component';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';
import { OrderClientEditComponent } from '../../doanh-nghiep/order-client/order-client-edit/order-client-edit.component';
import { OrderStatusUpdateComponent } from '../../doanh-nghiep/order-client/order-status-update/order-status-update.component';
import { OrderActionsUpdateComponent } from '../../doanh-nghiep/order-client/order-actions-update/order-actions-update.component';
import { OrdersMultiActionComponent } from '../../doanh-nghiep/order-client/orders-multi-action/orders-multi-action.component';
import { OrdersMultiShipComponent } from '../../doanh-nghiep/order-client/orders-multi-ship/orders-multi-ship.component';
import { OrdersDetailShipComponent } from '../../doanh-nghiep/order-client/orders-detail-ship/orders-detail-ship.component';
import TimeAgo from 'javascript-time-ago'
import vi from 'javascript-time-ago/locale/vi.json'

@Component({
    selector: 'app-order-shop-client',
    templateUrl: './order-shop-client.component.html',
    styleUrls: ['./order-shop-client.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrderShopClientComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        ctv: '',
        idProduct: -1,
        shipStatus: '',
        isShip: -1,
        status: [],
        statusRole: [],
        actions: [],
        actionsRole: [],
        fromDate: '',
        toDate: '',
        dayNumber: -1
    };
    status_options = [];
    actions_options = [];
    listOrdersPrint: any[] = [];
    orderTypeShip_options = [];
    orderType_options = [];
    colFilter: any = {};
    disabled = false;
    ref: DynamicDialogRef;
    crrUser: User;
    vi: any;
    timeAgo: any;

    @ViewChild(OrderClientEditComponent) _orderEdit: OrderClientEditComponent;
    // @ViewChild(OrderHistoryComponent) _OrderHistory: OrderHistoryComponent;
    @ViewChild(OrdersMultiActionComponent) _OrdersMultiAction: OrdersMultiActionComponent;
    @ViewChild(OrdersMultiShipComponent) _OrdersMultiShip: OrdersMultiShipComponent;
    @ViewChild(OrdersDetailShipComponent) _OrdersDetailShip: OrdersDetailShipComponent;
    @ViewChild(OrderEditComponent) _orderAdd: OrderEditComponent;

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        public dialogService: DialogService,
        private _OrdersService: OrdersService,
        private _StatusService: StatusService,
        private activatedRoute: ActivatedRoute,
        private _ActionsService: ActionsService,
        private _UserService: UserService,
    ) {
        super(null, _injector);
    }

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
                width: '3%',
                sort: true,
            },
            {
                field: 'code',
                header: 'Mã đơn',
                visible: true,
                align: 'center',
            },
            {
                field: 'deliveryDate',
                header: 'Thời gian nhận hàng',
                visible: true,
                dataType: 'date',
                align: 'center',
                sort: true,
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: false,
                dataType: 'date',
                align: 'center',
                sort: true,
            },
            {
                field: 'updatedDate',
                header: 'Cập nhật',
                visible: false,
                dataType: 'date',
                align: 'center',
                sort: true,
            },
            {
                field: 'completedDate',
                header: 'Ngày thành công',
                visible: false,
                dataType: 'date',
                align: 'center',
                sort: true,
            },
            {
                field: 'ctvName',
                header: 'CTV',
                visible: false,
            },
            {
                field: 'ctvPhone',
                header: 'SĐT CTV',
                visible: false,
            },
            {
                field: 'listNameProduct',
                header: 'Tên sản phẩm',
                visible: true,
                filterOptions: this.colFilter.tenSanPham,
                width: '15%',
            },
            {
                field: 'name',
                header: 'Họ và tên',
                visible: true,
                width: '15%',
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
                visible: true,
                align: 'center',
            },
            {
                field: 'paymentChannel',
                header: 'Hình thức thanh toán',
                visible: false,
                align: 'center',
            },
            {
                field: 'isPrepay',
                header: 'Thanh toán',
                width: '3%',
                visible: true,
                align: 'center',
            },
            {
                field: 'total',
                header: 'Tiền hàng',
                dataType: 'number',
                visible: false,
                align: 'right',
            },
            {
                field: 'shopName',
                header: 'Cửa hàng',
                visible: false,
                align: 'left',
            },
            {
                field: 'ship',
                header: 'Vận chuyển',
                dataType: 'number',
                visible: false,
                align: 'right',
            },
            {
                field: 'totalBill',
                header: 'Tổng tiền',
                dataType: 'number',
                visible: true,
                //width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'totalReward',
                header: 'Thưởng CTV',
                dataType: 'number',
                visible: false,
                align: 'right',
            },
            {
                field: 'totalRewardReferral',
                header: 'Thưởng người giới thiệu',
                dataType: 'number',
                visible: false,
                align: 'right',
            },
            {
                field: 'systemFee',
                header: 'Phí DapFood',
                dataType: 'number',
                visible: false,
                align: 'right',
            },
            {
                field: 'actions',
                header: 'Tác nghiệp',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'status',
                header: 'Trạng thái',
                visible: true,
                align: 'center',
                sort: true
            },
        ];
        await this.loadTypeShip();
        await this.loadStatus();
        await this.loadActions();
        await this.loadOrderType();
        await this.activatedRoute.params.map(params => [params['key'], params['status'], params['fromDate'], params['toDate']]).subscribe(async ([key, status, fromDate, toDate]) => {
            if (status) {
                this.searchModel.status = status.split(',').map(Number);;
            }
            if (fromDate) {
                this.searchModel.fromDate = new Date(fromDate);
            }
            if (toDate) {
                this.searchModel.toDate = new Date(toDate);
            }
            if (key) {
                this.searchModel.key = key;
            }
        });

        await this.getData();

    }

    async loadStatus() {
        await this._StatusService.GetListByRoles().then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.status_options.push({ label: item.name, value: item.id });
                    this.searchModel.statusRole.push(item.id);
                });
            }
        });
    }

    async loadTypeShip() {
        this.orderTypeShip_options.push({ label: '-- Tác nghiệp Ship --', value: -1 });
        this.orderTypeShip_options.push({ label: 'Đã tác nghiệp Ship', value: 1 });
        this.orderTypeShip_options.push({ label: 'Chưa tác nghiệp Ship', value: 0 });
    }

    async loadActions() {
        this.actions_options = [{ label: '-- Tác nghiệp --', value: -1 }];
        await this._ActionsService.GetListByRoles().then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.actions_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadOrderType() {
        this.orderType_options = [{ label: '-- Loại đơn --', value: -1 }];
        this.orderType_options.push({ label: 'Đơn từ link', value: 0 });
        this.orderType_options.push({ label: 'Đơn trực tiếp', value: 1 });
    }

    async onPrintOrder() {
        this.isLoading = true;
        let lstId = this.ids.toString();
        await this._OrdersService.GetDetailPrint(lstId).then(async response => {
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

    showOrdersMultiAction() {
        if (this.dataSource.filter(d => d.checked == true).length <= 0) {
            this._notifierService.showError("Chọn đơn hàng để tác nghiệp nhiều !");
            return false;
        }
        this._OrdersMultiAction.showPopup(this.dataSource.filter(d => d.checked == true));
    }

    showOrdersMultiShip() {
        if (this.dataSource.filter(d => d.checked == true).length <= 0) {
            this._notifierService.showError("Chọn đơn hàng để ship !");
            return false;
        }

        var lstShip = this.dataSource.filter(d => d.checked == true && !d.shipStatus); //don hang chua ship shipStatus == null
        var lstShiped = this.dataSource.filter(d => d.checked == true && d.shipStatus); // don hang da ship
        lstShiped = lstShiped.filter(d => d.shipStatus === 'CANCELLED' || d.shipStatus === 'FAILED');
        if (lstShip.length + lstShiped.length !== this.dataSource.filter(d => d.checked == true).length) {
            this._notifierService.showError("Đơn hàng được chọn đã hoặc đang được ship !");
            return false;
        }

        if (this.dataSource.filter(d => d.checked == true && (d.idStatus === 999 || d.idStatus === 31)).length > 0) {
            this._notifierService.showError("Đơn đã hoàn thành hoặc bị hủy không thể ship tiếp !");
            return false;
        }
        this._OrdersMultiShip.showPopup(this.dataSource.filter(d => d.checked == true));
    }

    onShipDetail(codeShip) {
        this._OrdersDetailShip.showPopup(codeShip);
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
        this._orderAdd.showPopup(0);
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        let statusSearch = [];
        //Chi lay nhung trang thai da duoc phan quyen inner join voi list status goc
        //Neu tim kiem = null thi lay tu list status goc
        if (this.searchModel.status && this.searchModel.status.length > 0) {
            statusSearch = this.searchModel.status.filter(it => this.searchModel.statusRole.includes(it));
        } else {
            //statusSearch = this.searchModel.statusRole;
        }
        //test
        //statusSearch = this.searchModel.status;
        await this._OrdersService.GetForShop(
            this.searchModel.key,
            this.searchModel.ctv,
            this.searchModel.idProduct,
            this.searchModel.shipStatus,
            this.searchModel.isShip,
            statusSearch,
            this.searchModel.actions,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.dayNumber,
            this.searchModel.orderType,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            (this.isAsc ? 1 : 0),
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.dataTotal = [rs.dataTotal];
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
        this._orderEdit.showPopup(id);
    }

    onEditIdRef(idRef: any) {
        this._orderEdit.showPopup(null, idRef);
    }

    // onViewHistory(item: any) {
    //     this._OrderHistory.showPopup(item);
    // }

    getNameShipStatus(status) {
        switch (status) {
            case 'IDLE': {
                return 'Nhận đơn';
            }
            case 'ASSIGNING': {
                return 'Đang tìm tài xế';
            }
            case 'ACCEPTED': {
                return 'Tìm được tài xế';
            }
            case 'IN PROCESS': {
                return 'Đã lấy, đang giao';
            }
            case 'COMPLETED': {
                return 'Hoàn thành';
            }
            case 'CANCELLED': {
                return 'Hủy đơn';
            }
            case 'FAILED': {
                return 'Không thể giao';
            }
        }
    }

    async onCloseForm(item: any) {
        await this.UpdateDataSource(item);
    }

    async onCloseFormIds(items: any) {
        //rechecked
        await this.UpdateDataSourceListId(items);
    }

    async UpdateDataSource(item: any) {
        if (item) {
            if (item.isDeleted && item.isDeleted == true) {
                this.dataSource.splice(this.dataSource.indexOf(item), 1);
            } else {
                const index = this.dataSource.findIndex(s => s.id === item.id);
                await this._OrdersService.GetForShop(item.id, '', -1, '', -1, [], [], null, null, null, -1, 0, 1, '', 0).then(rs => {
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

    async UpdateDataSourceListId(items: any) {
        if (items) {
            await this._OrdersService.GetForShop(items.join(' '), '', -1, '', -1, [], [], null, null, null, -1, 0, items.length, '', 0).then(rs => {
                if (rs.status) {
                    rs.data.forEach(element => {
                        const index = this.dataSource.findIndex(s => s.id === element.id);
                        if (index >= 0) {
                            element.checked = true;
                            this.dataSource[index] = element;
                        }
                    });
                }
            });

        }
    }

    PaymentCheck(code: string) {
        this._OrdersService.PaymentCheck(code).then(re => {
            if (re.status) {
                this.getData();
                this._notifierService.showSuccess("Đã thanh toán thành công !");
            }
            else
                this._notifierService.showError(re.message);
        });
    }

    onUpdateOrderStatus(item) {
        let ids = '';
        if (this.dataSource != null) {
            ids = this.dataSource.map((obj) => obj.id).toString();
        }
        this.ref = this.dialogService.open(OrderStatusUpdateComponent, {
            data: {
                idOrder: item.id,
                idStatus: item.idStatus,
            },
            header: 'Cập nhật trạng thái đơn hàng: ' + (item.code ? item.code : item.id),
            width: '70%',
            styleClass: "vs-modal",
            contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
            baseZIndex: 1001,
            closeOnEscape: true
        });

        this.ref.onClose.subscribe((re: any) => {
            if (re != null) {
                this.UpdateDataSource(item);
                this.isLoading = false;
            }
        });
    }

    onUpdateOrderAction(item) {
        let ids = '';
        if (this.dataSource != null) {
            ids = this.dataSource.map((obj) => obj.id).toString();
        }
        this.ref = this.dialogService.open(OrderActionsUpdateComponent, {
            data: {
                idOrder: item.id,
                idStatus: item.idStatus,
                idAction: item.idAction,
            },
            header: 'Cập nhật tác nghiệp - trạng thái đơn hàng: ' + (item.code ? item.code : item.id),
            width: '70%',
            styleClass: "vs-modal",
            contentStyle: { 'padding-top': '0px', 'overflow': 'auto' },
            baseZIndex: 1001,
            closeOnEscape: true
        });

        this.ref.onClose.subscribe((re: any) => {
            if (re != null) {
                this.UpdateDataSource(item);
                this.isLoading = false;
            }
        });
    }

}
