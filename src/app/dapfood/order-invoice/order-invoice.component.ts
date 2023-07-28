import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../services/orders.service';
import { StatusService } from '../services/status.service';
import { ActionsService } from '../services/actions.service';
import { ShopsService } from '../services/shops.service';
import { ProvincesService } from '../services/provinces.service';
import { User } from '../../lib-shared/models/user';
import { UserService } from '../../lib-shared/services/user.service';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { VnInvoiceService } from '../services/vninvoices.service';
import { InvoiceTemplatesService } from '../services/invoicetemplates.service';
import { CreateInvoiceComponent } from './create/create-invoice.component';

@Component({
    selector: 'app-order-invoice',
    templateUrl: './order-invoice.component.html',
    styleUrls: ['./order-invoice.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrderInvoiceComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        units: -1,
        idShop: -1,
        idProvince: -1,
        idDistrict: -1,
        idWard: -1,
        ctv: '',
        idProduct: -1,
        shipStatus: '',
        isShip: -1,
        status: [31],
        statusRole: [],
        actions: [],
        actionsRole: [],
        fromDate: '',
        toDate: '',
        dayNumber: -1,
        dateType: 0,
        orderType: -1,
        invoiceType: 0,
        isInvoiced: 0,
        paymentChannel: -1,
        idUserKol: -1,
        statusType: 1000,
    };
    status_options = [];
    actions_options = [];
    list_units = [];
    list_shops = [];
    list_status_invoice = [];
    list_statusType = [];
    list_Orderstatus = [];
    listOrdersPrint: any[] = [];
    orderTypeShip_options = [];
    orderType_options = [];
    paymentChannel_options = [];
    kol_options = [];
    colFilter: any = {};
    disabled = false;
    nameAddress = '';
    fromDate = '';
    toDate = '';
    ref: DynamicDialogRef;
    crrUser: User;
    vi: any;
    timeAgo: any;
    userId: number;
    topic = ['dapfood'];
    openSearchAdv = true;
    isShowInvoice = false;
    isShowInvoiceGroup = true;

    @ViewChild(CreateInvoiceComponent) _createInvoice: CreateInvoiceComponent;


    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        public dialogService: DialogService,
        private _OrdersService: OrdersService,
        private _StatusService: StatusService,
        private activatedRoute: ActivatedRoute,
        private _ActionsService: ActionsService,
        private _UserService: UserService,
        private _ShopsService: ShopsService,
        private _ProvincesService: ProvincesService,
        private _VnInvoiceService: VnInvoiceService,
        private _invoiceTemplatesService: InvoiceTemplatesService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.crrUser = await this._UserService.getCurrentUser();
        this.userId = this._UserService.getBasicUserInfo().userId;

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
                field: 'idOrderGroup',
                header: 'Mã TT online',
                visible: false,
                align: 'center',
                width: '3%',
                sort: false,
            },
            {
                field: 'code',
                header: 'Mã đơn',
                visible: true,
                align: 'center',
                width: '7%',
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
                field: 'deliveryDate',
                header: 'Thời gian nhận hàng',
                visible: false,
                dataType: 'date',
                align: 'center',
                sort: true,
            },
            {
                field: 'completedDate',
                header: 'Ngày thành công',
                visible: true,
                dataType: 'date',
                align: 'center',
                width: '7%',
                sort: true,
            },
            {
                field: 'ctvPhone',
                header: 'Người đặt',
                visible: true,
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
                header: 'Thông tin nhận hàng',
                visible: true,
                width: '15%',
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
                visible: false,
                align: 'center',
            },
            {
                field: 'paymentChannel',
                header: 'Hình thức thanh toán',
                visible: true,
                align: 'center',
                width: '4%',
            },
            {
                field: 'isPrepay',
                header: 'Thanh toán',
                width: '3%',
                visible: false,
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
                visible: true,
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
                width: '8%',
                align: 'right',
                sort: true
            },
            {
                field: 'isInvoice',
                header: 'Loại Hóa đơn',
                visible: false,
                //width: '5%',
                align: 'left',
                sort: true
            },
            {
                field: 'idInvoice',
                header: 'Hóa đơn',
                visible: true,
                //width: '5%',
                align: 'center',
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
        ];
        await this.loadTypeShip();
        await this.loadStatus();
        await this.loadActions();
        await this.loadOrderType();
        await this.loadUnits();
        await this.loadPaymentChannel();
        await this.loadKol();

        await this.activatedRoute.params.map(params => [params['key'], params['status'], params['fromDate'], params['toDate']]).subscribe(async ([key, status, fromDate, toDate]) => {
            if (status) {
                this.searchModel.status = status.split(',').map(Number);
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
        await this._StatusService.GetShort("Đã giao hàng").then(rs => {
            if (rs.status) {
                this.status_options = rs.data;
                rs.data.forEach(item => {
                    this.searchModel.statusRole.push(item.id);
                });
            }
        });
    }

    async loadKol() {
        this.kol_options = [{ label: '-- KOL --', value: -1 }];
        await this._UserService.GetsListKOL("").then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.kol_options.push({ label: item.userName + "(" + item.name + ")", value: item.userId });
                });
            }
        });
    }

    async onSearchType() {
        await this.getData();
        if (this.searchModel.invoiceType == 0) {
            this.isShowInvoice = false;
            this.isShowInvoiceGroup = true;
        }
        else if (this.searchModel.invoiceType == 1) {
            this.isShowInvoice = true;
            this.isShowInvoiceGroup = false;
        }
        else if (this.searchModel.invoiceType == 2) {
            this.isShowInvoice = true;
            this.isShowInvoiceGroup = true;
        }
        //await this.loadStatusType();
    }

    async onSearchStatus() {
        this.searchModel.status = [];
        this.searchModel.status.push(this.searchModel.statusType);
        await this.getData();
    }

    async loadPaymentChannel() {
        this.paymentChannel_options.push({ label: '-- Loại thanh toán --', value: -1 });
        this.paymentChannel_options.push({ label: 'COD', value: 0 });
        this.paymentChannel_options.push({ label: 'MoMo', value: 2 });
        this.paymentChannel_options.push({ label: 'ZaloPay', value: 3 });
        this.paymentChannel_options.push({ label: 'VNPay', value: 4 });
    }

    async loadTypeShip() {
        this.orderTypeShip_options.push({ label: '-- Tác nghiệp Ship --', value: -1 });
        this.orderTypeShip_options.push({ label: 'Đã tác nghiệp Ship', value: 1 });
        this.orderTypeShip_options.push({ label: 'Chưa tác nghiệp Ship', value: 0 });
    }

    async loadActions() {
        this.actions_options = [{ label: '-- Tác nghiệp --', value: -1 }];
        await this._ActionsService.GetShort("").then(rs => {
            if (rs.status) {
                this.actions_options = rs.data;
            }
        });
    }

    async loadStatusInvoice() {
        this.list_status_invoice = [];
        this.list_status_invoice.push({ label: 'Hóa đơn xuất lẻ ', value: 0 });
        this.list_status_invoice.push({ label: 'Hóa đơn xuất gộp ', value: 1 });
        this.list_status_invoice.push({ label: 'Hóa đơn đã xuất', value: 2 });
    }

    async loadUnits() {
        this.list_units = [];
        await this._ProvincesService.GetShortProduct(-1, -1).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.list_units.push({ label: item.label, value: item.value });
                });
            }
        });
    }

    async loadShops() {
        if (this.searchModel.idProvince > 0) {
            this.list_shops = [{ label: '-- Cửa hàng --', value: -1 }];
        }
        await this._ShopsService.GetShortByLocationSelect(-1, this.searchModel.idProvince, -1, -1, -1).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.list_shops.push({ label: item.code + ' - ' + item.name, value: item.value });
                });
            }
        });
    }

    async loadOrderType() {
        this.orderType_options = [{ label: '-- Loại đơn --', value: -1 }];
        this.orderType_options.push({ label: 'Đơn từ CTV', value: 1 });
        this.orderType_options.push({ label: 'Đơn từ NTD', value: 4 });
        this.orderType_options.push({ label: 'Đơn từ Cửa hàng', value: 3 });
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

    async showCreateMultiInvoice() {
        if (this.dataSource.filter(d => d.checked == true).length <= 0) {
            this._notifierService.showError("Chọn đơn hàng để tạo hóa đơn!");
            return false;
        }
        //console.log("danh sach id don hang da chon: " + this.ids);
        let createinvoice: any = {
            typeinvoice: 0,//0 là xuất lẻ, 1 là xuất gộp
            data: this.dataSource.filter(d => d.checked == true),
            ids: this.ids
        }
        this._createInvoice.showPopup(createinvoice);
    }
    async showCreateMultiInvoiceGroup() {
        if (this.dataSource.filter(d => d.checked == true).length <= 0) {
            this._notifierService.showError("Chọn đơn hàng để tạo hóa đơn!");
            return false;
        }
        //console.log("danh sach id don hang da chon: " + this.ids);
        let createinvoice: any = {
            typeinvoice: 1,//0 là xuất lẻ, 1 là xuất gộp
            data: this.dataSource.filter(d => d.checked == true),
            ids: this.ids
        }
        this._createInvoice.showPopup(createinvoice);
    }
    async getData() {
        this.isLoading = true;
        await this.loadStatusInvoice();
        this.dataSource = [];
        await this._OrdersService.GetForInvoice(
            this.searchModel.key,
            this.searchModel.idShop ? this.searchModel.idShop : -1,
            this.searchModel.idProvince ? this.searchModel.idProvince : -1,
            this.searchModel.idDistrict ? this.searchModel.idDistrict : -1,
            this.searchModel.dateType,
            this.searchModel.invoiceType,
            this.searchModel.ctv,
            this.searchModel.idProduct ? this.searchModel.idProduct : -1,
            this.searchModel.shipStatus,
            this.searchModel.isShip,
            this.searchModel.status,
            this.searchModel.actions,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.dayNumber,
            this.searchModel.paymentChannel,
            this.searchModel.idUserKol ? this.searchModel.idUserKol : -1,
            this.searchModel.orderType,
            this.searchModel.isInvoiced,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            (this.isAsc ? 1 : 0),
        ).then(rs => {
            if (rs.status) {
                //console.log("danh sach don hang = " + JSON.stringify(rs.data))
                this.dataSource = rs.data;
                this.dataTotal = [rs.dataTotal];
                this.total = rs.totalRecord;
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    getAvatar(id) {
        if (id) {
            return this.getImageAvatar(id);
        }
        else {
            return `/assets/images/avatar.jpg`;
        }
    }
    onSearch() {
        this.getData();
    }

    toggleSearch() {
        super.toggleSearch();

        this.fixTableScrollProblem();
    }
    async onChangeRowLimit() {
        this.fixTableScrollProblem();
    }
    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    async fixTableScrollProblem() {
        await this.getData();
    }

    async onCloseForm() {
        this.getData();
    }

    async SynInfoTemplate() {
        this.isLoading = true;
        this._invoiceTemplatesService.SynInfoTemplate().then(response => {
            if (response.status) {
                this._notifierService.showSuccess('Mẫu hóa đơn thành công!');
                this.isLoading = false;
            }
            else {
                this._notifierService.showError(response.message);
                this.isLoading = false;
            }
        });
    }

    async downloadPdf(base64Data, fileName) {
        let pdfWindow = window.open("");
        pdfWindow.document.write("<html<head><title>" + fileName + "</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>");
        pdfWindow.document.write("<body><embed width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(base64Data) + "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>");
    }
    async onClickDownloadPdf(erpId: any) {
        this.isLoading = true;
        await this._VnInvoiceService.PrintUnOfficial(erpId).then(re => {
            //console.log("view hoa don the hien = " + JSON.stringify(re));
            if (re.status) {
                this.downloadPdf(re.data.data.data, erpId);
                this.isLoading = false;
            }
            else {
                this._notifierService.showError(re.message);
                this.isLoading = false;
            }
        });
    }
}
