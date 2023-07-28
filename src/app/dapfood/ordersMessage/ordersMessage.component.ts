import { ProductService } from './../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from './../../lib-shared/services/configuration.service';
import { ProvincesService } from './../services/provinces.service';
import { ShopsService } from './../services/shops.service';
import { CustomerInfoComponent } from './../cskh/customer-info/customer-info.component';
import { DynamicDialogRef, DialogService } from 'primeng/api';
import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { OrdersMessageService } from '../services/ordersMessage.service';
import { OrdersMessageEditComponent } from './ordersMessage-edit/ordersMessage-edit.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
declare var omiSDK: any;
@Component({
    selector: 'app-ordersMessage',
    templateUrl: './ordersMessage.component.html',
    styleUrls: ['./ordersMessage.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrdersMessageComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        isActive: -1,
        type: -1,
        idShop: -1,
        idProvince: -1,
        idStatus: -1,
        fromDate: new Date(),
        toDate: new Date(),
        idProduct: -1
    };
    cols2 = [];
    cols3 = [];
    cols4 = [];
    cols5 = [];
    limitShop: number = 100;
    limitCustomer: number = 100;
    limitShopProduct: number = 100;
    limitProduct: number = 100;
    pageShop: number = 1;
    pageCustomer: number = 1;
    pageShopProduct: number = 1;
    pageProduct: number = 1;
    active_options: any[];
    list_units = [];
    list_shops = [];
    status_options: any[];
    UserIdSelected: number;
    ref: DynamicDialogRef;
    vi: any;
    timeAgo: any;
    selectedProduct = [];
    resultsProduct: any;
    textAutoComplete: string = "";
    tableType: number = 1;
    @ViewChild(OrdersMessageEditComponent) _OrdersMessageEditComponent: OrdersMessageEditComponent;

    constructor(
        protected _injector: Injector,
        private _OrdersMessageService: OrdersMessageService,
        public dialogService: DialogService,
        private _ShopsService: ShopsService,
        private _ProvincesService: ProvincesService,
        private _configurationService: ConfigurationService,
        private _ProductService: ProductService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.searchModel.fromDate.setDate(this.searchModel.fromDate.getDate());

        this.cols = [
            {
                field: 'userId',
                header: 'Mã KH',
                visible: true,
                align: 'center',
                width: '3%',
                sort: true
            },
            // {
            //     field: 'fullName',
            //     header: 'Tên khách hàng',
            //     visible: true,
            //     align: 'center',
            //     width: '5%',
            //     sort: true
            // },
            // {
            //     field: 'userName',
            //     header: 'SĐT đăng nhập',
            //     visible: true,
            //     align: 'center',
            //     width: '5%',
            //     sort: true
            // },
            {
                field: 'name',
                header: 'Tên',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'phone',
                header: 'SĐT',
                visible: true,
                width: '5%',
            },
            {
                field: 'fullAddress',
                header: 'Địa chỉ',
                visible: true,
                width: '10%',
            },
            {
                field: 'message',
                header: 'Báo lỗi',
                visible: true,
            },
            {
                field: 'shopName',
                header: 'Cửa hàng',
                visible: true,
                width: '10%',
            },
            {
                field: 'total',
                header: 'Tổng tiền',
                visible: true,
                width: '5%',
                align: 'right',
                sort: true
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                align: 'center',
                dataType: 'date',
                width: '5%',
            },
            {
                field: 'ordersMessageDetail',
                header: 'Giỏ hàng',
                visible: true,
                align: 'center',
                width: '20%',
                sort: true
            },
            {
                field: 'idStatus',
                header: 'Trạng thái',
                visible: true,
                align: 'center',
                width: '5%',
            }
        ];

        this.cols2 = [
            {
                field: 'code',
                header: 'Mã cửa hàng',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true
            },
            {
                field: 'name',
                header: 'Tên cửa hàng',
                visible: true,
                sort: true
            },
            {
                field: 'num',
                header: 'Số khách hàng',
                visible: true,
                sort: true,
                align: 'center',
                width: '10%',
            },
            {
                field: 'numClick',
                header: 'Số click',
                visible: true,
                sort: true,
                align: 'center',
                width: '10%',
            },
        ];

        this.cols3 = [
            {
                field: 'code',
                header: 'Mã sản phẩm',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'shop',
                header: 'Tên cửa hàng',
                visible: true,
            },
            {
                field: 'num',
                header: 'Số khách hàng',
                align: 'center',
                visible: true,
                sort: true,
                width: '10%',
            },
        ];

        this.cols4 = [
            {
                field: 'code',
                header: 'Mã sản phẩm',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                sort: true
            },
            {
                field: 'num',
                header: 'Số khách hàng',
                visible: true,
                align: 'center',
                sort: true,
                width: '10%',
            },
        ];

        this.cols5 = [
            {
                field: 'userId',
                header: 'Mã KH',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true
            },
            {
                field: 'numCo',
                header: 'Số lần',
                visible: true,
                align: 'center',
                sort: true,
                width: '10%',
            },
            {
                field: 'name',
                header: 'Tên',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'phone',
                header: 'SĐT',
                visible: true,
                width: '5%',
            },
            {
                field: 'address',
                header: 'Địa chỉ',
                visible: true,
            },
            // {
            //     field: 'message',
            //     header: 'Báo lỗi',
            //     visible: true,
            // },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                align: 'center',
                width: '10%',
                dataType: 'date',
            },
        ];

        await this.loadActiveOptions();
        await this.loadStatusOptions();
        await this.getData();
        await this.loadUnits();
    }

    callOmiCall(item, phoneType) {
        this.UserIdSelected = item.userId;
        omiSDK.makeCall(phoneType == 1 ? item.phone : item.userName, { datas: { 'User-Data': "UserId_" + item.userId } });
    }

    async loadActiveOptions() {
        this.active_options = [{ label: '-- Trạng thái hoạt động --', value: -1 }];
        this.active_options.push({ label: 'Không sử dụng', value: 0 });
        this.active_options.push({ label: 'Sử dụng', value: 1 });
    }

    async loadStatusOptions() {
        this.status_options = [{ label: '-- Trạng thái --', value: -1 }];
        this.status_options.push({ label: 'Chưa xử lý', value: 1 });
        this.status_options.push({ label: 'Đang xử lý', value: 2 });
        this.status_options.push({ label: 'Đã xử lý', value: 3 });
    }

    async loadUnits() {
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

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._OrdersMessageService.Gets(
            this.searchModel.key,
            this.searchModel.isActive,
            this.searchModel.idShop,
            this.searchModel.idProvince,
            this.searchModel.idStatus,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.idProduct,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    async reportOrdersMessageByCustomer() {
        this.isLoading = true;
        this.dataSource = [];
        await this._OrdersMessageService.ReportOrdersMessageByCustomer(
            this.searchModel.key,
            this.searchModel.isActive,
            this.searchModel.idShop,
            this.searchModel.idProvince,
            this.searchModel.idStatus,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.idProduct,
            (this.pageCustomer - 1) * this.limitCustomer,
            this.limitCustomer,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    async reportOrdersMessageByProduct() {
        this.isLoading = true;
        this.dataSource = [];
        await this._OrdersMessageService.ReportOrdersMessageByProduct(
            this.searchModel.key,
            this.searchModel.isActive,
            this.searchModel.idShop,
            this.searchModel.idProvince,
            this.searchModel.idStatus,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.idProduct,
            (this.pageProduct - 1) * this.limitProduct,
            this.limitProduct,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    async reportOrdersMessageByShop() {
        this.isLoading = true;
        this.dataSource = [];
        await this._OrdersMessageService.ReportOrdersMessageByShop(
            this.searchModel.key,
            this.searchModel.isActive,
            this.searchModel.idShop,
            this.searchModel.idProvince,
            this.searchModel.idStatus,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.idProduct,
            (this.pageShop - 1) * this.limitShop,
            this.limitShop,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    async reportOrdersMessageByShopProduct() {
        this.isLoading = true;
        this.dataSource = [];
        await this._OrdersMessageService.ReportOrdersMessageByShopProduct(
            this.searchModel.key,
            this.searchModel.isActive,
            this.searchModel.idShop,
            this.searchModel.idProvince,
            this.searchModel.idStatus,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.idProduct,
            (this.pageShopProduct - 1) * this.limitShopProduct,
            this.limitShopProduct,
            this.sortField,
            this.isAsc
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
        if (this.tableType == 1) {
            this.getData();
        }
        else if (this.tableType == 2) {
            this.reportOrdersMessageByShop();
        }
        else if (this.tableType == 3) {
            this.reportOrdersMessageByShopProduct();
        }
        else if (this.tableType == 4) {
            this.reportOrdersMessageByProduct();
        }
        else if (this.tableType == 5) {
            this.reportOrdersMessageByCustomer();
        }
    }

    onEdit(id: any) {
        this._OrdersMessageEditComponent.showPopup(id);
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Xóa bản ghi ?', 'Bạn có chắc muốn xóa bản ghi này ?').then(rs => {
            this._OrdersMessageService.delete(id).then(re => {
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

    onActive(item: any, e) {
        const obj = {
            id: item.id,
            isActive: e.checked
        };
        this._OrdersMessageService.Active(obj).then(rs => {
            this._notifierService.showSuccess(rs.message);
        });
    }

    async autoComplete(event) {
        const query = event.query;
        let ids = '';
        if (this.selectedProduct != null) {
            ids = this.selectedProduct.map((obj) => obj.id).toString();
        }
        await this._ProductService.Autocomplete(
            query,
            (this.page - 1) * this.limit,
            this.limit
        ).then(rs => {
            if (rs.status) {
                this.resultsProduct = rs.data;
            }
        });
    }

    onSelect(event) {
        // if (this.selectedProduct.findIndex(rs => rs.id === event.id) < 0) {
        //     this.selectedProduct.push(event);
        //     event.quantity = 1;
        // } else {
        //     this._notifierService.showError('Sản phẩm này đã được chọn');
        // }
        this.searchModel.idProduct = event.id;
    }

    // onChange(event) {
    //     console.log(event.name)
    //     if (!event.name) {
    //         this.searchModel.idProduct = 0;
    //     }
    // }
    onClearAutoComplete() {
        this.searchModel.idProduct = -1;
        this.textAutoComplete = "";
    }

    onChangeTable(tableType) {
        this.tableType = tableType;
        if (tableType == 1) {
            this.limit = 100;
            this.page = 1;
            this.getData();
        }
        else if (tableType == 2) {
            this.limitShop = 100;
            this.pageShop = 1;
            this.reportOrdersMessageByShop();
        }
        else if (tableType == 3) {
            this.limitShopProduct = 100;
            this.pageShopProduct = 1;
            this.reportOrdersMessageByShopProduct();
        }
        else if (tableType == 4) {
            this.limitProduct = 100;
            this.pageProduct = 1;
            this.reportOrdersMessageByProduct();
        }
        else if (tableType == 5) {
            this.limitCustomer = 100;
            this.pageCustomer = 1;
            this.reportOrdersMessageByCustomer();
        }
    }

    onPageCustomer(event: any): void {
        this.pageCustomer = (event.first / event.rows) + 1;
        this.limitCustomer = event.rows;
        this.reportOrdersMessageByCustomer();
    }

    onPageShop(event: any): void {
        this.pageShop = (event.first / event.rows) + 1;
        this.limitShop = event.rows;
        this.reportOrdersMessageByShop();
    }

    onPageShopProduct(event: any): void {
        this.pageShopProduct = (event.first / event.rows) + 1;
        this.limitShopProduct = event.rows;
        this.reportOrdersMessageByShopProduct();
    }

    onPageProduct(event: any): void {
        this.pageProduct = (event.first / event.rows) + 1;
        this.limitProduct = event.rows;
        this.reportOrdersMessageByProduct();
    }

    // onChangeFilterProduct(name: string, id: number) {
    //     this.searchModel.idProduct = id;
    //     this.textAutoComplete = name;
    //     debugger
    // }

    toggleSearch() {
        super.toggleSearch();
        this.fixTableScrollProblem();
    }
    onChangeRowLimit() {
        this.fixTableScrollProblem();
    }

    onChangeRowLimitCustomer() {
        this.reportOrdersMessageByCustomer();
        this.fixTableScrollProblem();
    }

    onChangeRowLimitProduct() {
        this.reportOrdersMessageByProduct();
        this.fixTableScrollProblem();
    }

    onChangeRowLimitShop() {
        this.reportOrdersMessageByShop();
        this.fixTableScrollProblem();
    }

    onChangeRowLimitShopProduct() {
        this.reportOrdersMessageByShopProduct()
        this.fixTableScrollProblem();
    }

    onSort(event: any) {
        this.sortField = event.field;
        this.isAsc = event.order === 1 ? false : true;
        if (this.tableType == 1) {
            this.getData();
        }
        else if (this.tableType == 2) {
            this.reportOrdersMessageByShop();
        }
        else if (this.tableType == 3) {
            this.reportOrdersMessageByShopProduct();
        }
        else if (this.tableType == 4) {
            this.reportOrdersMessageByProduct();
        }
        else if (this.tableType == 5) {
            this.reportOrdersMessageByCustomer();
        }
    }

    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    fixTableScrollProblem() {
        this.dataSource = [...this.dataSource];
    }
    onCloseForm() {
        this.getData();
    }

    onShowDetailUserCurr(item) {
        this.ref = this.dialogService.open(CustomerInfoComponent, {
            data: {
                userId: item
            },
            header: 'Thông tin khách hàng',
            width: '95%',
            height: 'calc(100vh - 100px)',
            styleClass: "vs-modal",
            contentStyle: { 'overflow': 'auto', 'position': 'relative' }, //'max-height': 'calc(100vh - 180px);', 
            baseZIndex: 1001,
            closeOnEscape: true
        });

        this.ref.onClose.subscribe((re: any) => {
            this.isLoading = false;
        });
    }
    getAvatar(id) {
        if (id) {
            return this.getImageAvatar(id);
        }
        else {
            return `/assets/images/avatar.jpg`;
        }
    }

    exportExcelTable(tableType: any) {
        const data = [];
        this.dataSource.forEach(item => {
            const row = {};
            if (tableType == 1) {
                this.cols.forEach(col => {
                    let celValue = item[col.field];
                    if (celValue) {// Format Date
                        if (col.dataType === 'date') {
                            celValue = moment.utc(celValue).format('YYYY-MM-DD HH:mm');
                        }
                        if (col.dataType === 'number') {
                            celValue = (celValue).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
                        }
                    }
                    row[col.header] = celValue;
                });
            }
            else if (tableType == 2) {
                this.cols2.forEach(col => {
                    let celValue = item[col.field];
                    if (celValue) {// Format Date
                        if (col.dataType === 'date') {
                            celValue = moment.utc(celValue).format('YYYY-MM-DD HH:mm');
                        }
                        if (col.dataType === 'number') {
                            celValue = (celValue).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
                        }
                    }
                    row[col.header] = celValue;
                });
            }
            else if (tableType == 3) {
                this.cols3.forEach(col => {
                    let celValue = item[col.field];
                    if (celValue) {// Format Date
                        if (col.dataType === 'date') {
                            celValue = moment.utc(celValue).format('YYYY-MM-DD HH:mm');
                        }
                        if (col.dataType === 'number') {
                            celValue = (celValue).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
                        }
                    }
                    row[col.header] = celValue;
                });
            }
            else if (tableType == 4) {
                this.cols4.forEach(col => {
                    let celValue = item[col.field];
                    if (celValue) {// Format Date
                        if (col.dataType === 'date') {
                            celValue = moment.utc(celValue).format('YYYY-MM-DD HH:mm');
                        }
                        if (col.dataType === 'number') {
                            celValue = (celValue).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
                        }
                    }
                    row[col.header] = celValue;
                });
            }
            else if (tableType == 5) {
                this.cols5.forEach(col => {
                    let celValue = item[col.field];
                    if (celValue) {// Format Date
                        if (col.dataType === 'date') {
                            celValue = moment.utc(celValue).format('YYYY-MM-DD HH:mm');
                        }
                        if (col.dataType === 'number') {
                            celValue = (celValue).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
                        }
                    }
                    row[col.header] = celValue;
                });
            }
            data.push(row);
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, this.exportName);
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}


