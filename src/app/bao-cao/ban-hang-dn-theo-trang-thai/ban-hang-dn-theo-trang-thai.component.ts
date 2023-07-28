import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ReportService } from '../report.service';

@Component({
    selector: 'ban-hang-dn-theo-trang-thai',
    templateUrl: './ban-hang-dn-theo-trang-thai.component.html',
    styleUrls: ['./ban-hang-dn-theo-trang-thai.component.scss']
})
export class BanHangDNTheoTrangThaiComponent extends SecondPageIndexBase implements OnInit {

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
                field: 'idStatus',
                header: 'Mã trạng thái',
                visible: true,
                align: 'center',
                width: '70px',
            },
            {
                field: 'name',
                header: 'Tên trạng thái',
                visible: true,
                align: 'left',
                width: '350px',
            },
            {
                field: 'count',
                header: 'Số lượng',
                visible: true,
                align: 'right',
            },
            {
                field: 'countApp',
                header: 'App',
                visible: true,
                align: 'right',
            },
            {
                field: 'countVerified',
                header: 'Xác minh',
                visible: true,
                align: 'right',
            },
            {
                field: 'countPrepay',
                header: 'Trả trước',
                visible: true,
                align: 'right',
            },
            {
                field: 'countShip',
                header: 'Đã ship',
                visible: true,
                align: 'right',
            },
            {
                field: 'money',
                header: 'Tiền',
                visible: true,
                align: 'right',
            },
            {
                field: 'money',
                header: 'App',
                visible: true,
                align: 'right',
            },
            {
                field: 'moneyVerified',
                header: 'Xác minh',
                visible: true,
                align: 'right',
            },
            {
                field: 'moneyPrepay',
                header: 'Trả trước',
                visible: true,
                align: 'right',
            },
            {
                field: 'moneyReward',
                header: 'Hoa hồng',
                visible: true,
                align: 'right',
            },
            {
                field: 'ship',
                header: 'Ship thu',
                visible: true,
                align: 'right',
            },
            {
                field: 'shipRoot',
                header: 'Ship chi',
                visible: true,
                align: 'right',
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
        await this._ReportService.Report_BaoCaoBanHangDNTheoTrangThai(
            this.searchModel.fromDate,
            this.searchModel.toDate
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.dataTotal = rs.data.length;
                this.total = rs.data.length;
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

    onCloseForm() {
        this.getData();
    }

}
