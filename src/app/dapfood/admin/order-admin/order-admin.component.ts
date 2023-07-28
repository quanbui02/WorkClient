import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';
import { EnumOrderStatus } from '../../common/constant';
import { OrderHistoryComponent } from '../../ctv/orders/order-history/order-history.component';
import { ClientsService } from '../../services/clients.service';
import { OrdersService } from '../../services/orders.service';
import { StatusService } from '../../services/status.service';
import { OrderAdminEditComponent } from './order-admin-edit/order-admin-edit.component';
import { UserAddressService } from '../../services/useraddress.service';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { CustomerInfoComponent } from '../../cskh/customer-info/customer-info.component';

@Component({
    selector: 'app-order-admin',
    templateUrl: './order-admin.component.html',
    styleUrls: ['./order-admin.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrderAdminComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        ctv: '',
        idProduct: -1,
        status: [],
        fromDate: new Date(),
        toDate: new Date(),
        fromUpdate: '',
        toUpdate: '',
        //idGroup: -1,
        isDeleted: false,
        isPaidReward: false
        // statusBanHang: -1
    };
    EnumOrderStatus = EnumOrderStatus;
    status_options = [];
    clients_options = [];
    //group_options = [];
    orderDelete_options = [];
    // statusBanHang_options = [];
    // product_options = [];
    orderType_options = [];
    colFilter: any = {};
    // danhSachTenSanPham: any[] = [];
    disabled = false;
    vi: any;
    ref: DynamicDialogRef;

    @ViewChild(OrderAdminEditComponent) _orderEdit: OrderAdminEditComponent;
    @ViewChild(OrderHistoryComponent) _OrderHistory: OrderHistoryComponent;
    openSearchAdv = true;

    constructor(
        protected _injector: Injector,
        private activatedRoute: ActivatedRoute,
        private _OrdersService: OrdersService,
        private _configurationService: ConfigurationService,
        private _StatusService: StatusService,
        private _ClientsService: ClientsService,
        private _UserAddressService: UserAddressService,
        public dialogService: DialogService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;

        this.searchModel.fromDate.setDate(this.searchModel.fromDate.getDate() - 30);

        this.cols = [
            {
                field: 'id',
                header: 'Mã',
                visible: true,
                align: 'center',
                width: '4%',
                sort: true,
            },
            // {
            //     field: 'idParent',
            //     header: 'Đơn cha',
            //     visible: true,
            //     align: 'center',
            //     width: '4%',
            //     sort: true,
            // },
            {
                field: 'idOrderGroup',
                header: 'Nhóm đơn',
                visible: false,
                align: 'center',
                width: '4%',
                sort: true,
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: false,
                dataType: 'date',
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'deliveryDate',
                header: 'Thời gian nhận hàng',
                visible: true,
                dataType: 'date',
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'clientName',
                header: 'Đơn vị',
                visible: false,
                width: '10%',
                sort: true,
            },
            {
                field: 'clientPhone',
                header: 'SĐT Đơn vị',
                visible: false,
                sort: true,
            },
            {
                field: 'ctvName',
                header: 'Người tạo',
                visible: true,
                width: '10%',
                sort: true,
            },
            {
                field: 'ctvPhone',
                header: 'SĐT CTV',
                visible: false,
                align: 'center',
                width: '5%',
                sort: true,
            },
            // {
            //     field: 'landingUrl',
            //     header: 'Link',
            //     visible: true,
            //     align: 'center',
            //     width: '4%',
            //     sort: true,
            // },
            {
                field: 'listNameProduct',
                header: 'Tên sản phẩm',
                visible: true,
                filterOptions: this.colFilter.tenSanPham,
                sort: true
            },
            {
                field: 'name',
                header: 'Họ và tên',
                visible: true,
                width: '7%',
                sort: true
            },
            {
                field: 'phone',
                header: 'SĐT',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true
            },
            {
                field: 'paymentChannel',
                header: 'Hình thức thanh toán',
                visible: false,
                align: 'center',
                width: '5%',
                sort: true
            },
            {
                field: 'isPrepay',
                header: 'Trạng thái thanh toán',
                visible: true,
                align: 'center',
                width: '6%',
                sort: true
            },
            {
                field: 'status',
                header: 'Trạng thái',
                visible: true,
                width: '8%',
                align: 'center',
                sort: true
            },
            {
                field: 'completedDate',
                header: 'Ngày thành công',
                visible: false,
                dataType: 'date',
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'total',
                header: 'Tiền hàng',
                dataType: 'number',
                visible: true,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'ship',
                header: 'Vận chuyển',
                dataType: 'number',
                visible: true,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'discount',
                header: 'Giảm giá',
                dataType: 'number',
                visible: true,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'totalBill',
                header: 'Tổng tiền',
                dataType: 'number',
                visible: true,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'deposit',
                header: 'Đặt cọc',
                dataType: 'number',
                visible: false,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'totalGift',
                header: 'Quà tặng',
                dataType: 'number',
                visible: false,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'productReward',
                header: 'Thưởng theo sản phẩm',
                dataType: 'number',
                visible: false,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'promotionReward',
                header: 'Thưởng khuyến mãi',
                dataType: 'number',
                visible: false,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'prepayReward',
                header: 'Thưởng trả trước',
                dataType: 'number',
                visible: false,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'totalReward',
                header: 'Hoa hồng',
                dataType: 'number',
                visible: false,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'totalRewardReferral',
                header: 'Thưởng giới thiệu',
                dataType: 'number',
                visible: false,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'systemFee',
                header: 'Phí',
                dataType: 'number',
                visible: false,
                width: '4%',
                align: 'right',
                sort: true
            },
            {
                field: 'dayNumber',
                header: 'Ngày chưa tác nghiệp',
                dataType: 'number',
                visible: false,
                width: '4%',
                align: 'center',
                sort: true
            }
        ];
        //await this.loadGroups();
        await this.loadStatus();
        // await this.loadStatusBanHang();
        await this.loadOrderType();
        await this.loadClients();
        // await this.loadProduct();
        this.activatedRoute.params.map(params => [params['idc'], params['ctv'], params['fdate'], params['tdate']]).subscribe(async ([idc, ctv, fdate, tdate]) => {
            if (idc >= 0) {
                this.searchModel.idClient = Number.parseInt(idc);
            }
            if (ctv) {
                this.searchModel.ctv = ctv;
            }
            if (fdate) {
                this.searchModel.fromDate = new Date(fdate);
                this.searchModel.toDate = new Date(tdate);
                this.disabled = true;
            }
            await this.getData();
        });
        // await this.getData();
    }

    // async  loadProduct() {
    //     this.product_options = [{ label: '-- Sản phẩm --', value: -1 }];
    //     await this._OrdersService.GetForOrder().then(rs => {
    //         if (rs.status) {
    //             rs.data.forEach(item => {
    //                 this.product_options.push({ label: item.name, value: item.id });
    //             });
    //         }
    //     });
    // }

    // async loadGroups() {
    //     this.group_options = [{ label: '-- Tất cả nhóm --', value: -1 }];
    //     await this._GroupsServices.Gets('', 0, 1000).then(rs => {
    //         if (rs.status) {
    //             rs.data.forEach(item => {
    //                 this.group_options.push({ label: item.name, value: item.id });
    //             });
    //         }
    //     });
    // }

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

    async loadStatus() {
        this.status_options = [];   // { label: '-- Trạng thái --', value: -1 }
        await this._StatusService.Gets('', 0, 1000).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.status_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadClients() {
        this.clients_options = [];
        await this._ClientsService.GetShort('').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.clients_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadOrderType() {
        this.orderType_options = [];
        this.orderType_options.push({ label: 'Đơn từ link', value: 0 });
        this.orderType_options.push({ label: 'Đơn từ app', value: 1 });
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }
    async getData() {
        this.dataSource = [];
        this.isLoading = true;
        await this._OrdersService.GetForAdmin(
            this.searchModel.key,
            this.searchModel.idClient,
            this.searchModel.ctv,
            this.searchModel.idProduct,
            this.searchModel.status,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.fromUpdate,
            this.searchModel.toUpdate,
            this.searchModel.dayNumber,
            this.searchModel.orderType,
            this.searchModel.isDeleted,
            this.searchModel.isPaidReward,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
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
    onChangeRowLimit() {
        this.fixTableScrollProblem();
    }
    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    fixTableScrollProblem() {
        console.log(JSON.stringify([...this.dataSource]))
        this.dataSource = [...this.dataSource];
    }

    onEdit(id: any) {
        this._orderEdit.showPopup(id);
    }

    onViewHistory(item: any) {
        this._OrderHistory.showPopup(item);
    }

    onCloseForm() {
        this.getData();
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

    onDelete(id: number) {
        this._notifierService.showConfirm('Bạn có chắc muốn xóa đơn này?', 'Xóa đơn').then(rs => {
            this._OrdersService.delete(id).then(re => {
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

    CheckedIsPaidReward() {
        // Nếu isPaidReward == true là chỉ lấy những đơn thành công
        if (this.searchModel.isPaidReward) {
            this.searchModel.fromDate = '';
            this.searchModel.toDate = '';

            this.searchModel.fromUpdate = new Date();
            this.searchModel.toUpdate = new Date();
        }
        else {
            this.searchModel.fromDate = new Date();
            this.searchModel.toDate = new Date();

            this.searchModel.fromUpdate = '';
            this.searchModel.toUpdate = '';
        }
    }

    onShowDetailUserCurr(item) {
        this.ref = this.dialogService.open(CustomerInfoComponent, {
            data: {
                userId: item.userId
            },
            header: 'Thông tin khách hàng',
            width: '95%',
            height: 'calc(100vh - 100px)',
            styleClass: "vs-modal",
            contentStyle: { 'overflow': 'auto' }, //'max-height': 'calc(100vh - 180px);', 
            baseZIndex: 1001,
            closeOnEscape: true
        });

        this.ref.onClose.subscribe((re: any) => {
            if (re != null) {
                this.isLoading = false;
            }
        });
    }

}
