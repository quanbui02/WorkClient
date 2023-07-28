import { EventEmitterService } from './../../services/eventemitter.service';
import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { StatementsService } from '../services/statements.service';
import { OrderEditComponent } from '../ctv/orders/order-edit/order-edit.component';
import { OrdersService } from '../services/orders.service';
import { UserAddressService } from '../services/useraddress.service';
import { UserService } from '../../lib-shared/services/user.service';
import { User } from '../../lib-shared/models/user';
import { environment } from '../../../environments/environment';
import { OrderHistoryComponent } from '../ctv/orders/order-history/order-history.component';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { OrderRatingComponent } from '../ctv/orders/order-rating/order-rating.component';
import TimeAgo from 'javascript-time-ago'
import vi from 'javascript-time-ago/locale/vi.json'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashBoardComponent extends SecondPageIndexBase implements OnInit {
    data: any = {
        totalSales: 0,
        totalProfit: 0,
        totalProfitSuccess: 0,
        balance: 0
    };
    searchModel: any = {
        key: '',
        orderType: -1,
        idProduct: -1,
        status: -1,
        statusBanHang: -1,
        cSKHTime: 0,
        dnTime: 1,
    };
    currentUser = new User;
    isCTV: any = false;
    isDN: any = false;
    isCSKH: any = false;
    isAdmin: any = false;
    lstLastOrder: any = [];
    lstLastStatusOrder: any = [];
    CSKHTime_options: any = [];
    dataStatus: any = [];
    timeAgo: any;
    vi: any;
    fromDate: Date;
    toDate: Date;
    sumChoDuyet: any = 0;
    sumDaDuyet: any = 0;
    sumKho: any = 0;
    sumShip: any = 0;
    sumHoanThanh: any = 0;
    sumCapNhat: any = 0;
    sumHuyDon: any = 0;
    RfromDate: any;
    RtoDate: any;
    linkOrder = '';
    @ViewChild(OrderEditComponent) _orderEdit: OrderEditComponent;
    @ViewChild(OrderHistoryComponent) _OrderHistory: OrderHistoryComponent;
    @ViewChild(OrderRatingComponent) _OrderRating: OrderRatingComponent;

    constructor(
        private _userService: UserService,
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _StatementsService: StatementsService,
        private _OrdersService: OrdersService,
        private _UserAddressService: UserAddressService,
        private _EventEmitterService: EventEmitterService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.currentUser = this._userService.getBasicUserInfo();
        this.vi = this._configurationService.calendarVietnamese;

        TimeAgo.addDefaultLocale(vi);
        this.timeAgo = new TimeAgo('vi-VN');

        // this.cols = [
        //     {
        //         field: 'code',
        //         header: 'Mã',
        //         visible: true,
        //         align: 'center',
        //         sort: false,
        //         width: '100px',
        //     },
        //     {
        //         field: 'infoCustomer',
        //         header: 'Thông tin khách hàng',
        //         visible: true,
        //         align: 'left',
        //         sort: false,
        //     },
        //     {
        //         field: 'infoStatus',
        //         header: 'Trạng thái',
        //         visible: true,
        //         align: 'left',
        //         sort: false,
        //         width: '180px',
        //     },
        //     {
        //         field: 'infoAction',
        //         header: 'Tác nghiệp',
        //         visible: true,
        //         align: 'left',
        //         sort: false,
        //         width: '180px',
        //     },
        //     {
        //         field: 'totalBill',
        //         header: 'Tổng tiền',
        //         visible: true,
        //         align: 'right',
        //         sort: false,
        //         width: '120px',
        //     },
        //     {
        //         field: 'totalReward',
        //         header: 'Hoa hồng',
        //         visible: true,
        //         align: 'right',
        //         sort: false,
        //         width: '120px',
        //     },
        //     {
        //         field: 'createdDate',
        //         header: 'Ngày tạo',
        //         visible: true,
        //         align: 'left',
        //         sort: false,
        //         width: '140px',
        //     },
        //     {
        //         field: 'updatedDate',
        //         header: 'Cập nhật gần nhất',
        //         visible: true,
        //         align: 'left',
        //         sort: false,
        //         width: '100px',
        //     },
        // ];

        var lstRole = JSON.parse(this.currentUser.roleassign);
        if (lstRole.filter(d => d.toUpperCase() === 'SHOP').length > 0) {
            this.linkOrder = 'orders-shop';
        }
        if (lstRole.filter(d => d.toUpperCase() === 'DN' || d.toUpperCase() === 'DNKT' || d.toUpperCase() === 'DNKHO' || d.toUpperCase() === 'DNSALE').length > 0) {
            this.linkOrder = 'orders-clients';
        }
        if (lstRole.filter(d => d.toUpperCase() === 'DN' || d.toUpperCase() === 'DNKT' || d.toUpperCase() === 'DNKHO' || d.toUpperCase() === 'DNSALE' || d.toUpperCase() === 'SHOP').length > 0) {
            this.isDN = true;
            this.CSKHTime_options = [
                { label: 'Tất cả', value: 0 },
                { label: 'Hôm nay', value: 1 },
                { label: 'Hôm qua', value: 2 },
                { label: 'Tuần này', value: 3 },
                { label: 'Tuần trước', value: 4 },
                { label: 'Tháng này', value: 5 },
                { label: 'Tháng trước', value: 6 },
            ];
            // await this.loadSatementDN();
            // await this.loadStatusDN();
            //await this.loadListLastOrderDN();
            // await this.loadListLastStatusOrderDN();
        }
        this.isAdmin = this.currentUser.issuperuser;
        if (lstRole.filter(d => d.toUpperCase() === 'CTV').length > 0) {
            this.isCTV = true;
            await this.loadListLastOrder();
            await this.loadSatement();
        }

        if (lstRole.filter(d => d.toUpperCase() === 'SUPPORT').length > 0 || lstRole.filter(d => d.toUpperCase() === 'CSKH').length > 0) {
            this.isCSKH = true;
            this.CSKHTime_options = [
                { label: 'Tất cả', value: 0 },
                { label: 'Hôm nay', value: 1 },
                { label: 'Hôm qua', value: 2 },
                { label: 'Tuần này', value: 3 },
                { label: 'Tuần trước', value: 4 },
                { label: 'Tháng này', value: 5 },
                { label: 'Tháng trước', value: 6 },
            ];
            // await this.loadSatementCSKH();
        }

        this._EventEmitterService.event.subscribe(item => this.notifyTrigger(item));
    }

    showStatusWithIcon(item: any) {
        return '<span class="fa fa-refresh" style="font-size:12px;"></span> ' + this.GetStatus(item);
    }

    GetListOrdersWattingShip() {
        this.isLoading = true;
        this._OrdersService.GetListOrdersWattingShip();
        this.isLoading = false;
        this._notifierService.showSuccess("Thao tác thành công !");
    }

    GetListOrdersNeedShip() {
        this.isLoading = true;
        this._OrdersService.GetListOrdersNeedShip();
        this.isLoading = false;
        this._notifierService.showSuccess("Thao tác thành công !");
    }

    GetIsSyn() {
        this.isLoading = true;
        this._UserAddressService.GetIsSyn();
        this.isLoading = false;
        this._notifierService.showSuccess("Thao tác thành công !");
    }

    async notifyTrigger(data: any) {
        if (data.type === 3) {
            if (data.data) {
                if (data.data.balance) {
                    await this.loadSatement();
                    await this.getData();
                }
            }
        }
    }

    formatDate(date: string) {
        var myDate = new Date(date);
        return myDate.getTime();
    }

    getTimeAgo(date: string) {
        if (date !== null && date.length > 0 && date !== '0001-01-01T00:00:00Z')
            return this.timeAgo.format(this.formatDate(date.replace('T', ' ').replace('Z', '')))
    }

    async loadSatement() {
        await this._StatementsService.GetBalance().then(rs => {
            if (rs.status) {
                this.data = rs.data;
            }
        });
    }

    async loadSatementDN() {
        var now = new Date();
        await this._StatementsService.GetBalanceDN(now, now, 0).then(rs => {
            if (rs.status) {
                this.data = rs.data;
            }
        });
    }

    async loadStatusDN() {
        this.isLoading = true;
        var now = new Date();
        await this._StatementsService.ThongKeDNTheoTrangThai(null, null, this.searchModel.dnTime).then(rs => {
            if (rs.status) {
                this.dataStatus = rs.data;
                this.sumChoDuyet = this.dataStatus.filter(d => d.idStatus === 1000).reduce((sum, current) => sum + current.count, 0);
                this.sumDaDuyet = this.dataStatus.filter(d => d.idStatus === 1).reduce((sum, current) => sum + current.count, 0);
                this.sumHoanThanh = this.dataStatus.filter(d => d.idStatus === 31).reduce((sum, current) => sum + current.count, 0);
                this.sumKho = this.dataStatus.filter(d => d.idStatus === 2 || d.idStatus === 20).reduce((sum, current) => sum + current.count, 0);
                this.sumShip = this.dataStatus.filter(d => d.idStatus === 21 || d.idStatus === 23 || d.idStatus === 30).reduce((sum, current) => sum + current.count, 0);
                this.sumCapNhat = this.dataStatus.filter(d => d.idStatus === 3 || d.idStatus === 22 || d.idStatus === 33 || d.idStatus === 34 || d.idStatus === 40).reduce((sum, current) => sum + current.count, 0);
                this.sumHuyDon = this.dataStatus.filter(d => d.idStatus === 999).reduce((sum, current) => sum + current.count, 0);
                var dataTotal = rs.dataTotal;
                this.RfromDate = dataTotal.fromDate;
                this.RtoDate = dataTotal.toDate;
            }
        });
        this.isLoading = false;
    }

    async loadSatementCSKH() {
        var now = new Date();
        this.isLoading = true;
        await this._StatementsService.GetBalanceCSKH(now, now, this.searchModel.cSKHTime).then(rs => {
            if (rs.status) {
                this.data = rs.data;
            }
        });
        this.isLoading = false;
    }

    async loadListLastOrderDN() {
        await this._OrdersService.GetLastOrderReportDN().then(rs => {
            if (rs.status) {
                this.lstLastOrder = rs.data;
            }
        });
    }

    async loadListLastStatusOrderDN() {
        this.isLoading = true;
        await this._OrdersService.GetTopChangeStatus().then(rs => {
            if (rs.status) {
                this.lstLastStatusOrder = rs.data;
            }
        });
        this.isLoading = false;
    }

    async loadListLastOrder() {
        await this._OrdersService.GetLastOrderReport().then(rs => {
            if (rs.status) {
                this.lstLastOrder = rs.data;
            }
        });
    }
}
