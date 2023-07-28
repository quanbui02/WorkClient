import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ReportService } from '../report.service';
import { ProvincesService } from '../../dapfood/services/provinces.service';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-bao-cao-ban-hang-theo-cua-hang',
    templateUrl: './bao-cao-ban-hang-theo-cua-hang.component.html',
    styleUrls: ['./bao-cao-ban-hang-theo-cua-hang.component.scss']
})
export class BaoCaoBanHangTheoCuaHangComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        idProvince: -1,
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
        private _ProvincesService: ProvincesService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.searchModel.fromDate.setDate(this.searchModel.toDate.getDate() - 30);
        this.cols = [
            {
                field: 'id',
                header: 'Mã',
                visible: false,
                align: 'center',
                width: '70px',
            },
            {
                field: 'name',
                header: 'Tên cửa hàng',
                visible: true,
                align: 'left',
                width: '350px',
            },
            {
                field: 'code',
                header: 'Mã cửa hàng',
                visible: true,
                align: 'left',
            },
            {
                field: 'count',
                header: 'Số đơn',
                visible: true,
                dataType: 'number',
                align: 'right',
                sort: true
            },
            {
                field: 'total',
                header: 'Tiền hàng',
                visible: true,
                dataType: 'number',
                align: 'right',
                sort: true
            },
            {
                field: 'discount',
                header: 'Giảm giá',
                visible: true,
                dataType: 'number',
                align: 'right',
                sort: true
            },
            {
                field: 'ship',
                header: 'Ship',
                visible: true,
                dataType: 'number',
                align: 'right',
                sort: true
            },
            {
                field: 'totalBill',
                header: 'Tổng thu',
                visible: true,
                dataType: 'number',
                align: 'right',
                sort: true
            },
            {
                field: 'cod',
                header: 'COD',
                visible: true,
                dataType: 'number',
                align: 'right',
                sort: true
            },
            {
                field: 'moMo',
                header: 'MoMo',
                visible: true,
                dataType: 'number',
                align: 'right',
                sort: true
            },
            {
                field: 'zaloPay',
                header: 'ZaloPay',
                visible: true,
                dataType: 'number',
                align: 'right',
                sort: true
            },
            {
                field: 'vnPay',
                header: 'VNPay',
                visible: true,
                dataType: 'number',
                align: 'right',
                sort: true
            }
        ];
        await this.loadUnits();
        //await this.loadShops();
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

    initDefaultOption() {
        this.searchModel.key = '';
    }
    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        if (!this.searchModel.idProvince) {
            this.searchModel.idProvince = -1;
        }
        await this._ReportService.Report_BaoCaoBanHangTheoCuaHang(
            this.searchModel.idProvince,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.dataTotal = [rs.dataTotal];
                this.total = rs.totalRecord;
                this.loadbarchart(this.dataSource);
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    async loadbarchart(datachar: any) {
        this.Player = [];
        this.Run = [];
        var charttotalBill = {
            label: 'Tổng thu',
            data: [],
            backgroundColor: 'rgba(0, 99, 132, 1)',
            borderColor: 'rgba(0, 99, 132, 1)',
        };
        var chartcod = {
            label: 'COD',
            data: [],
            backgroundColor: 'rgba(99, 132, 0, 1)',
            borderColor: 'rgba(99, 132, 0, 1)',
        };
        var chartmoMo = {
            label: 'MoMo',
            data: [],
            backgroundColor: 'rgba(165, 0, 100, 1)',
            borderColor: 'rgba(99, 132, 0, 1)',
        };
        var chartzaloPay = {
            label: 'ZaloPay',
            data: [],
            backgroundColor: 'rgba(26, 13, 171, 1)',
            borderColor: 'rgba(99, 132, 0, 1)',
        };
        var chartvnPay = {
            label: 'VnPay',
            data: [],
            backgroundColor: 'rgba(0, 123, 255, 1)',
            borderColor: 'rgba(106, 224, 145, 1)',
        };

        datachar.forEach(x => {
            this.Player.push(x.code);
            charttotalBill.data.push(x.totalBill);
            chartcod.data.push(x.cod);
            chartmoMo.data.push(x.moMo);
            chartzaloPay.data.push(x.zaloPay);
            chartvnPay.data.push(x.vnPay);
        });

        var planetData = {
            labels: this.Player,
            datasets: [charttotalBill, chartcod, chartmoMo, chartzaloPay, chartvnPay]
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
