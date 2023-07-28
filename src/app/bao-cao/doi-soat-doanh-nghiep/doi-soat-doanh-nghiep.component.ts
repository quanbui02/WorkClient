import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ReportService } from '../report.service';

@Component({
    selector: 'app-doi-soat-doanh-nghiep',
    templateUrl: './doi-soat-doanh-nghiep.component.html',
    styleUrls: ['./doi-soat-doanh-nghiep.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DoiSoatDoanhNghiepComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        ctv: '',
        orderType: -1,
        idProduct: -1,
        status: -1,
        fromDate: new Date(),
        toDate: new Date(),
    };
    status_options = [];
    orderType_options = [];
    colFilter: any = {};
    disabled = false;
    openSearchAdv = true;
    vi: any;

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _ReportService: ReportService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.searchModel.fromDate.setDate(this.searchModel.toDate.getDate() - 30);
        this.cols = [
            {
                field: 'name',
                header: 'Tên doanh nghiệp',
                visible: true,
                align: 'left',
                sort: true,
            },
            {
                field: 'userName',
                header: 'Tài khoản',
                visible: true,
                align: 'left',
                width: '6%',
                sort: true,
            },
            // {
            //     field: 'soCTV',
            //     header: 'Số CTV',
            //     dataType: 'number',
            //     visible: true,
            //     align: 'right',
            //     width: '5%',
            //     sort: true,
            // },
            {
                field: 'tongSoDon',
                header: 'Tổng số đơn',
                visible: true,
                align: 'right',
                width: '6%',
                sort: true,
            },
            {
                field: 'donThanhCong',
                header: 'Số đơn thành công',
                visible: true,
                align: 'right',
                width: '6%',
                sort: true,
            },
            {
                field: 'totalBillLink',
                header: 'Đơn qua link',
                dataType: 'number',
                visible: true,
                align: 'right',
                width: '6%',
                sort: true
            },
            {
                field: 'totalBillManual',
                header: 'Đơn trực tiếp',
                visible: true,
                dataType: 'number',
                align: 'right',
                width: '6%',
                sort: true
            },
            {
                field: 'totalBill',
                header: 'Tổng xu',
                visible: true,
                dataType: 'number',
                align: 'right',
                width: '6%',
                sort: true
            },
            {
                field: 'totalReward',
                header: 'Tổng thưởng CTV',
                visible: true,
                dataType: 'number',
                align: 'right',
                width: '6%',
                sort: true
            },
            {
                field: 'systemFee',
                header: 'Phí dịch vụ',
                visible: true,
                dataType: 'number',
                align: 'right',
                width: '6%',
                sort: true
            },
            // {
            //     field: 'diemNap',
            //     header: 'Số xu nạp',
            //     visible: true,
            //     dataType: 'number',
            //     align: 'right',
            //     width: '5%',
            //     sort: true
            // },
            // {
            //     field: 'diemRut',
            //     header: 'Số xu rút',
            //     visible: true,
            //     dataType: 'number',
            //     align: 'right',
            //     width: '5%',
            //     sort: true
            // },
            {
                field: 'balance',
                header: 'Số dư hiện tại',
                visible: true,
                dataType: 'number',
                align: 'right',
                width: '6%',
                sort: true
            }
        ];
        // await this.loadStatus();
        await this.loadOrderType();
        await this.getData();
    }

    // async loadStatus() {
    //     this.status_options = [{ label: '-- Trạng thái --', value: -1 }];
    //     await this._StatusService.Gets('', 0, 1000).then(rs => {
    //         if (rs.status) {
    //             rs.data.forEach(item => {
    //                 this.status_options.push({ label: item.name, value: item.id });
    //             });
    //         }
    //     });
    // }

    async loadOrderType() {
        this.orderType_options = [{ label: '-- Loại đơn --', value: -1 }];
        this.orderType_options.push({ label: 'Đơn từ link', value: 0 });
        this.orderType_options.push({ label: 'Đơn tự tạo', value: 1 });
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }
    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._ReportService.ReportDSDN(
            this.searchModel.key,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.dataTotal = [rs.dataTotal];
                this.total = rs.totalRecord;
            } else {
                this._notifierService.showError(rs.message);
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

    onViewTransaction(item: any) {
        this._router.navigate(['statements-histories-admin', { userid: item.userId, fdate: this.searchModel.fromDate, tdate: this.searchModel.toDate, status: 1 }]);
    }

    onViewOrder(item: any) {
        this._router.navigate(['orders-admin', { idc: item.idClient, fdate: this.searchModel.fromDate, tdate: this.searchModel.toDate }]);
    }

    onCloseForm() {
        this.getData();
    }

}
