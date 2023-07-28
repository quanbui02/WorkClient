import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { StatusService } from '../../services/status.service';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { OrderHistoryComponent } from '../../ctv/orders/order-history/order-history.component';
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';

@Component({
    selector: 'app-order-leader',
    templateUrl: './order-leader.component.html',
    styleUrls: ['./order-leader.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrderLeaderComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        ctv: '',
        orderType: -1,
        idProduct: -1,
        status: [],
        fromDate: new Date(),
        toDate: new Date(),
        dayNumber: -1
        // statusBanHang: -1
    };
    status_options = [];
    // statusBanHang_options = [];
    // product_options = [];
    orderType_options = [];
    colFilter: any = {};
    // danhSachTenSanPham: any[] = [];
    disabled = false;

    // results: any;
    // key: string;

    vi: any;

    // @ViewChild(OrderEditComponent) _orderEdit: OrderEditComponent;
    @ViewChild(OrderHistoryComponent) _OrderHistory: OrderHistoryComponent;

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _OrdersService: OrdersService,
        private _StatusService: StatusService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;

        this.searchModel.fromDate.setDate(this.searchModel.fromDate.getDate() - 30);

        this.cols = [
            {
                field: 'idRef',
                header: 'Mã',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                align: 'center',
                width: '8%',
                sort: true,
            },
            {
                field: 'ctv',
                header: 'CTV',
                visible: true,
                width: '10%',
                sort: true,
            },
            {
                field: 'ctvPhone',
                header: 'SĐT CTV',
                visible: true,
                align: 'center',
                width: '8%',
                sort: true,
            },
            {
                field: 'landingUrl',
                header: 'Link',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'listNameProduct',
                header: 'Tên sản phẩm',
                visible: true,
                width: '35%',
                sort: true
            },
            // {
            //     field: 'name',
            //     header: 'Họ và tên',
            //     visible: true,
            //     width: '10%',
            //     sort: true
            // },
            // {
            //     field: 'phone',
            //     header: 'Số điện thoại',
            //     visible: true,
            //     align: 'center',
            //     width: '8%',
            //     sort: true
            // }, 
            // {
            //     field: 'reason',
            //     header: 'Trạng thái bán hàng',
            //     visible: true,
            //     width: '10%',
            //     align: 'center',
            //     sort: true
            // },
            {
                field: 'status',
                header: 'Trạng thái giao hàng',
                visible: true,
                width: '10%',
                align: 'center',
                sort: true
            },
            {
                field: 'totalBill',
                header: 'Tổng tiền',
                visible: true,
                dataType: 'number',
                width: '6%',
                align: 'right',
                sort: true
            },
            {
                field: 'totalReward',
                header: 'Thưởng CTV',
                visible: true,
                dataType: 'number',
                width: '6%',
                align: 'right',
                sort: true
            }
        ];
        await this.loadStatus();
        await this.loadOrderType();
        await this.getData();
    }

    async loadStatus() {
        this.status_options = [{ label: '-- Trạng thái --', value: -1 }];
        await this._StatusService.Gets('', 0, 1000).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.status_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadOrderType() {
        this.orderType_options = [{ label: '-- Loại đơn --', value: -1 }];
        this.orderType_options.push({ label: 'Đơn từ link', value: 0 });
        this.orderType_options.push({ label: 'Đơn trực tiếp', value: 1 });
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }
    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._OrdersService.GetForLeader(
            this.searchModel.key,
            this.searchModel.ctv,
            this.searchModel.idProduct,
            this.searchModel.status,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.dayNumber,
            this.searchModel.orderType,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField
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

    // onEdit(id: any) {
    //     this._orderEdit.showPopup(id);
    // }

    onViewHistory(item: any) {
        this._OrderHistory.showPopup(item);
    }

    onCloseForm() {
        this.getData();
    }

}
