import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ReportService } from '../report.service';

@Component({
    selector: 'app-bao-cao-doanh-so-cskh',
    templateUrl: './bao-cao-doanh-so-cskh.component.html',
    styleUrls: ['./bao-cao-doanh-so-cskh.component.scss']
})
export class BaoCaoDoanhSoCSKHComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        fromDate: new Date(),
        toDate: new Date(),
    };

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
                header: 'Tài khoản',
                visible: true,
                align: 'left',
                sort: true,
            },
            {
                field: 'phone',
                header: 'SĐT',
                visible: true,
                align: 'left',
                sort: true,
            },
            {
                field: 'total',
                header: 'Doanh số',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'count',
                header: 'Tổng số đơn',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'reward',
                header: 'Hoa hồng',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'countPaid',
                header: 'Số đơn đã trả',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'totalPaid',
                header: 'Tiền đơn đã trả',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'count1000',
                header: 'Số đơn mới',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'total1000',
                header: 'Tiền đơn mới',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'reward1000',
                header: 'HH đơn mới',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'count1',
                header: 'Số đơn xác nhận',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'total1',
                header: 'Tiền đơn xác nhận',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'reward1',
                header: 'HH đơn xác nhận',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'count999',
                header: 'Số đơn hủy',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'total999',
                header: 'Tổng đơn hủy',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'count31',
                header: 'Số đơn thành công',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'total31',
                header: 'Tổng đơn thành công',
                visible: true,
                align: 'right',
                sort: true
            }
        ];
        await this.getData();
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }
    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._ReportService.BaoCaoDoanhSoCSKH(
            this.searchModel.fromDate,
            this.searchModel.toDate,
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
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
        this._router.navigate(['orders-admin', { ctv: item.userName, fdate: this.searchModel.fromDate, tdate: this.searchModel.toDate }]);
    }

    onCloseForm() {
        this.getData();
    }

}
