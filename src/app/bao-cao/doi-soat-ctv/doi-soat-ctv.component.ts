import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ReportService } from '../report.service';
import { GroupsService } from '../../dapfood/services/groups.service';
import { ProductService } from '../../dapfood/services/products.service';

@Component({
    selector: 'app-doi-soat-ctv',
    templateUrl: './doi-soat-ctv.component.html',
    styleUrls: ['./doi-soat-ctv.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DoiSoatCtvComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        ctv: '',
        idGroup: -1,
        idProduct: -1,
        status: -1,
        fromDate: new Date(),
        toDate: new Date(),
        fromUpdate: '',
        toUpdate: ''
    };
    status_options = [];
    group_options = [];
    colFilter: any = {};
    disabled = false;
    openSearchAdv = true;
    vi: any;

    results: any;
    products: any[];

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _GroupsServices: GroupsService,
        private _ProductService: ProductService,
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
                header: 'CTV',
                visible: true,
                align: 'left',
                sort: true,
            },
            {
                field: 'phone',
                header: 'SĐT',
                visible: true,
                align: 'left',
                width: '5%',
                sort: true,
            },
            {
                field: 'createdDate',
                header: 'Ngày đăng ký',
                visible: true,
                align: 'right',
                width: '8%',
                sort: true,
            },
            {
                field: 'soSpDangKy',
                header: 'Số SP đăng ký',
                dataType: 'number',
                visible: true,
                align: 'right',
                width: '5%',
                sort: true,
            },
            {
                field: 'tongSoDon',
                header: 'Tổng số đơn',
                visible: true,
                align: 'right',
                width: '5%',
                sort: true,
            },
            {
                field: 'donThanhCong',
                header: 'Số đơn thành công',
                visible: true,
                align: 'right',
                width: '5%',
                sort: true,
            },
            {
                field: 'totalBillLink',
                header: 'Đơn từ link',
                dataType: 'number',
                visible: true,
                align: 'right',
                width: '5%',
                sort: true
            },
            {
                field: 'totalBillManual',
                header: 'Đơn từ app',
                dataType: 'number',
                visible: true,
                align: 'right',
                width: '5%',
                sort: true
            },
            {
                field: 'totalBill',
                header: 'Tổng xu',
                dataType: 'number',
                visible: true,
                align: 'right',
                width: '5%',
                sort: true
            },
            {
                field: 'totalReward',
                header: 'Tổng thưởng CTV',
                dataType: 'number',
                visible: true,
                align: 'right',
                width: '5%',
                sort: true
            },
            // {
            //     field: 'phiDichVu',
            //     header: 'Phí dịch vụ',
            //     visible: true,
            //     align: 'right',
            //     width: '5%',
            //     sort: true
            // },
            {
                field: 'diemNap',
                header: 'Số xu nạp',
                dataType: 'number',
                visible: true,
                align: 'right',
                width: '5%',
                sort: true
            },
            {
                field: 'diemRut',
                header: 'Số xu rút',
                dataType: 'number',
                visible: true,
                align: 'right',
                width: '5%',
                sort: true
            },
            {
                field: 'balance',
                header: 'Số dư hiện tại',
                dataType: 'number',
                visible: true,
                align: 'right',
                width: '5%',
                sort: true
            }
        ];
        //await this.loadGroups();
        await this.getData();
    }

    async autoComplete(event) {
        await this._ProductService.Autocomplete(
            event.query,
            (this.page - 1) * this.limit,
            this.limit
        ).then(rs => {
            if (rs.status) {
                this.results = rs.data;
                this.total = rs.totalRecord;
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    async loadGroups() {
        this.group_options = [{ label: '-- Tất cả nhóm --', value: -1 }];
        this.group_options.push({ label: '-- Chưa tham gia nhóm --', value: 0 });
        await this._GroupsServices.Gets('', 0, 1000).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.group_options.push({ label: item.name, value: item.id });
                });
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        let ids = '';
        if (this.products != null) {
            ids = this.products.map((obj) => obj.id).toString();
        }
        await this._ReportService.ReportDSCTV(
            this.searchModel.key,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.fromUpdate,
            this.searchModel.toUpdate,
            ids,
            -1,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                const sss: any = {
                    totalBill: 0
                };

                this.dataTotal = rs.dataTotal != null ? [rs.dataTotal] : sss;
                this.total = rs.totalRecord;
            } else {
                this._notifierService.showError(rs.message);
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
        this.dataSource = [...this.dataSource];
    }

    onViewTransaction(item: any) {
        this._router.navigate(['statements-histories-admin', { userid: item.userId, fdate: this.searchModel.fromDate, tdate: this.searchModel.toDate, status: -1 }]);
    }

    onViewOrder(item: any) {
        this._router.navigate(['orders-admin', { ctv: item.userName, fdate: this.searchModel.fromDate, tdate: this.searchModel.toDate }]);
    }

    onCloseForm() {
        this.getData();
    }

}
