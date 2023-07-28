import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ReportService } from '../report.service';
import { ProvincesService } from '../../dapfood/services/provinces.service';
import { ShopsService } from '../../dapfood/services/shops.service';
import { Chart } from 'chart.js';

@Component({
    selector: 'bao-cao-don-hang-khach-hang',
    templateUrl: './bao-cao-don-hang-khach-hang.component.html',
    styleUrls: ['./bao-cao-don-hang-khach-hang.component.scss']
})
export class BaoCaoDonHangKhachHangComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        idProvince: -1,
        idShop: -1,
        fromDate: new Date(),
        toDate: new Date(),
    };
    list_units = [];
    list_shops = [];
    colFilter: any = {};
    disabled = false;
    openSearchAdv = true;
    vi: any;
    Player = [];
    Run = [];
    barchart = [];

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _ReportService: ReportService,
        private _ProvincesService: ProvincesService,
        private _ShopsService: ShopsService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.searchModel.fromDate.setDate(this.searchModel.toDate.getDate() - 30);

        this.cols = [
            {
                field: 'userId',
                header: 'Mã',
                visible: true,
                align: 'center',
                width: '70px',
            },
            {
                field: 'name',
                header: 'Tên khách',
                visible: true,
                align: 'left',
                width: '350px',
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
                visible: true,
                align: 'left',
            },
            {
                field: 'totalOrder',
                header: 'Số đơn',
                visible: true,
                dataType: 'number',
                align: 'right',
                sort: true
            },
            {
                field: 'totalSales',
                header: 'Tổng tiền',
                dataType: 'number',
                visible: true,
                align: 'right',
                sort: true
            }
        ];
        await this.loadUnits();
        await this.loadShops();
        await this.getData();
    }

    async loadUnits() {
        this.list_units = [{ label: '-- Tỉnh/thành phố --', value: -1 }];
        await this._ProvincesService.GetShortProduct(-1, -1).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.list_units.push({ label: item.label, value: item.value });
                });
            }
        });
    }

    async loadShops() {
        this.list_shops = [{ label: '-- Cửa hàng --', value: -1 }];
        await this._ShopsService.GetShortByLocationSelect(-1, this.searchModel.idProvince, -1, -1, -1).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.list_shops.push({ label: item.code + ' - ' + item.name, value: item.value });
                });
            }
        });
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }
    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        if (!this.searchModel.idProvince) {
            this.searchModel.idProvince = -1;
        }
        if (!this.searchModel.idShop) {
            this.searchModel.idShop = -1;
        }
        await this._ReportService.Report_BaoCaoKhachHangDonHang(
            this.searchModel.key,
            this.searchModel.idProvince,
            this.searchModel.idShop,
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
                console.log("du lieu thong ke " + JSON.stringify(this.dataSource));
                this.loadbarchart(this.dataSource);
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

    onCloseForm() {
        this.getData();
    }
    async loadbarchart(datachar: any) {
        this.Player = [];
        this.Run = [];


        datachar.forEach(x => {
            this.Player.push(x.name);
            this.Run.push(x.totalSales);
        });

        var planetData = {
            labels: this.Player,
            datasets: [{
                label: 'Tổng tiền',
                data: this.Run,
                borderColor: '#3cb371',
                backgroundColor: "#3cb371",
            }]
        };

        var chartOptions = {
            legend: {
                display: true
            },
            scales: {
                xAxes: [{
                    categoryPercentage: 0.6,
                    barPercentage: 1,
                }],
            },
            title: {
                display: true,
                text: 'Biểu đồ bán hàng của cửa hàng (triệu)'
            }
        };
        this.barchart = new Chart('myChart', {
            type: 'bar',
            data: planetData,
            options: chartOptions
        });
    }
}
