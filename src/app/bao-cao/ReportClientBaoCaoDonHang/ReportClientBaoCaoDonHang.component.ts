import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ReportService } from '../report.service';

@Component({
    selector: 'app-ReportClientBaoCaoDonHang',
    templateUrl: './ReportClientBaoCaoDonHang.component.html',
    styleUrls: ['./ReportClientBaoCaoDonHang.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReportClientBaoCaoDonHangComponent extends SecondPageIndexBase implements OnInit {

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
                header: 'Tên',
                visible: true,
                align: 'left',
                sort: true,
            },
            {
                field: 'quatity',
                header: 'Số lượng',
                visible: true,
                align: 'right',
                width: '10%',
                sort: true,
            },
            {
                field: 'percent',
                header: '% ',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            }
        ];
        await this.getData();
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._ReportService.Report_Client_BaoCaoDonHang(
            this.searchModel.fromDate,
            this.searchModel.toDate
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.dataTotal = [rs.dataTotal];
                this.total = rs.totalRecord;
            } else {
                this._notifierService.showError(rs.message);
            }
        });
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

}
