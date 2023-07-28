import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { StatusService } from '../../services/status.service';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';
import { EnumOrderStatus } from '../../common/constant';
import { OrderRatingComponent } from './order-rating/order-rating.component';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrdersComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        orderType: -1,
        idProduct: -1,
        status: -1,
        statusBanHang: -1,
        fromDate: new Date(),
        toDate: new Date()
    };
    EnumOrderStatus = EnumOrderStatus;
    status_options = [];
    statusBanHang_options = [];
    product_options = [];
    orderType_options = [];
    listOrdersPrint: any[] = [];
    dataSourceSeleted = [];
    lstStatus = []; //Khi get list Status luu luon de check hien thi button Huy theo trang thai
    colFilter: any = {};
    danhSachTenSanPham: any[] = [];
    disabled = false;
    vi: any;
    exportName = 'Danh-sach-don-hang';

    @ViewChild(OrderEditComponent) _orderEdit: OrderEditComponent;
    @ViewChild(OrderRatingComponent) _OrderRating: OrderRatingComponent;
    @ViewChild(OrderHistoryComponent) _OrderHistory: OrderHistoryComponent;

    constructor(
        protected _injector: Injector,
        private _OrdersService: OrdersService,
        private _StatusService: StatusService,
        private _configurationService: ConfigurationService
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
                sort: true,
                width: '60px',
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                dataType: 'date',
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'listNameProduct',
                header: 'Tên sản phẩm',
                visible: true,
                filterOptions: this.colFilter.tenSanPham,
                sort: true,
            },
            {
                field: 'name',
                header: 'Họ và tên',
                visible: true,
                width: '12%',
                sort: true
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
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
                width: '5%',
                sort: true
            },
            {
                field: 'status',
                header: 'Trạng thái',
                visible: true,
                width: '6%',
                align: 'center',
                sort: true
            },
            {
                field: 'total',
                header: 'Tiền hàng',
                dataType: 'number',
                visible: true,
                width: '6%',
                align: 'right',
                sort: true
            },
            {
                field: 'ship',
                header: 'Vận chuyển',
                dataType: 'number',
                visible: true,
                width: '6%',
                align: 'right',
                sort: true
            },
            {
                field: 'totalBill',
                header: 'Tổng tiền',
                dataType: 'number',
                visible: true,
                width: '6%',
                align: 'right',
                sort: true
            },
            {
                field: 'reward',
                header: 'Hoa hồng',
                dataType: 'number',
                visible: true,
                width: '6%',
                align: 'right',
                sort: true
            },
        ];
        await this.loadStatus();
        // await this.loadStatusBanHang();
        await this.loadOrderType();
        await this.loadProduct();
        await this.getData();
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

    async loadProduct() {
        this.product_options = [{ label: '-- Sản phẩm --', value: -1 }];
        await this._OrdersService.GetForOrder().then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.product_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadStatus() {
        this.status_options = [{ label: '-- Trạng thái --', value: -1 }];
        await this._StatusService.Gets('', 0, 1000).then(rs => {
            if (rs.status) {
                this.lstStatus = rs.data;
                rs.data.forEach(item => {
                    this.status_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    ShowButtonByStatus(item: any, statusChange: string) {
        if (this.lstStatus && item.idStatus) {
            var lstCheck = this.lstStatus.filter(d => d.id == item.idStatus);
            if (lstCheck) {
                var objCheck = lstCheck[0].actions;
                if (objCheck && objCheck.indexOf(';') != -1) {
                    var lstStatus = objCheck.split(";");
                    return lstStatus.findIndex(d => d == statusChange) != -1;
                }
            }
        }
        return false;
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
        await this._OrdersService.Gets(
            this.searchModel.key,
            this.searchModel.idProduct,
            this.searchModel.status,
            this.searchModel.fromDate,
            this.searchModel.toDate,
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

    onEdit(id: any) {
        this._orderEdit.showPopup(id);
    }
    onRating(id: any) {
        this._OrderRating.showPopup(id);
    }

    onViewHistory(item: any) {
        this._OrderHistory.showPopup(item);
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

    onCancel(item: any) {
        this._notifierService.showConfirm('Bạn có chắc muốn hủy đơn này?', 'Hủy đơn').then(rs => {
            let form = {
                idOrder: item.id,
                idStatus: EnumOrderStatus.HuyDon,
            }
            this._OrdersService.Actions(form).then(re => {
                if (re.status) {
                    this._notifierService.showSuccess('Hủy đơn thành công');
                    this.getData();
                }
                else {
                    this._notifierService.showError(re.message);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    async onCloseForm(item: any) {
        if (item && item.id > 0) {
            await this._OrdersService.Gets(item.id, -1, -1, null, null, -1, 0, 1).then(rs => {
                if (rs.status) {
                    let obj = rs.data[0];
                    const index = this.dataSource.findIndex(s => s.id === obj.id);
                    if (index >= 0) {
                        this.dataSource[index] = obj;
                    } else {
                        this.dataSource.splice(0, 0, obj);
                    }
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
}
