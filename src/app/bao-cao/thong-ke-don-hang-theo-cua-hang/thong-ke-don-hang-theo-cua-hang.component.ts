import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ProvincesService } from '../../dapfood/services/provinces.service';
import { Chart } from 'chart.js';
import { ShopsService } from '../../dapfood/services/shops.service';
import { StatisticsService } from '../statistic.service';

@Component({
    selector: 'app-thong-ke-don-hang-theo-cua-hang',
    templateUrl: './thong-ke-don-hang-theo-cua-hang.component.html',
    styleUrls: ['./thong-ke-don-hang-theo-cua-hang.component.scss']
})
export class ThongKeDonHangTheoCuaHangComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        idProvince: -1,
        idShop: -1,
        dateType: 2,
    };
    list_units = [];
    list_shops = [];
    colFilter: any = {};
    disabled = false;
    openSearchAdv = true;
    vi: any;
    barchartTotalOrder = null;
    barchartTotalBill = null;
    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _StatisticsService: StatisticsService,
        private _ProvincesService: ProvincesService,
        private _ShopsService: ShopsService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;

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
    initDefaultOption() {
        this.searchModel.key = '';
    }
    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        if (!this.searchModel.idProvince) {
            this.searchModel.idProvince = -1;
        }
        await this._StatisticsService.Report_chart_Order_Shop(
            this.searchModel.dateType,
            this.searchModel.idProvince
        ).then(rs => {
            if (rs.status) {
                console.log("du lieu thong ke = " + JSON.stringify(rs.data));
                this.dataSource = rs.data;
                this.dataTotal = [rs.dataTotal];
                this.total = rs.totalRecord;
                this.loadbarchartTotalOrder(this.dataSource);
                this.loadbarchartTotalBill(this.dataSource);
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    async loadbarchartTotalOrder(datachar: any) {
        var Player = [];
        var chartthanhCong = {
            label: 'Thành công',
            data: [],
            backgroundColor: 'rgba(0, 166, 81, 1)',
            borderColor: 'rgba(0, 99, 132, 1)',
        };
        var chartTongdon = {
            label: 'Tổng đơn',
            data: [],
            backgroundColor: 'rgba(45, 166, 254, 1)',
            borderColor: 'rgba(99, 132, 0, 1)',
        };
        var chartChuaHoanThanh = {
            label: 'Chưa hoàn thành',
            data: [],
            backgroundColor: 'rgba(165, 0, 100, 1)',
            borderColor: 'rgba(99, 132, 0, 1)',
        };
        var chartKhachHuy = {
            label: 'Khách hủy',
            data: [],
            backgroundColor: 'rgba(253, 107, 107, 1)',
            borderColor: 'rgba(106, 224, 145, 1)',
            stack: 'Huy',
        };
        var chartSaleHuy = {
            label: 'Sale hủy',
            data: [],
            backgroundColor: 'rgba(255, 0, 0, 1)',
            borderColor: 'rgba(106, 224, 145, 1)',
            stack: 'Huy',
        };

        datachar.forEach(x => {

            Player.push(x.nameShop);
            chartTongdon.data.push(x.totalOrder);
            chartthanhCong.data.push(x.thanhCong);
            chartChuaHoanThanh.data.push(x.chuaHoanThanh);
            chartKhachHuy.data.push(x.khachHuy);
            chartSaleHuy.data.push(x.saleHuy);
        });

        var planetData = {
            labels: Player,
            datasets: [chartthanhCong, chartSaleHuy, chartKhachHuy]
        };
        if (this.barchartTotalOrder != null) {
            this.barchartTotalOrder.destroy();
        }
        var chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            legend: {
                display: true
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            },
            title: {
                display: true,
                text: 'Biểu đồ số đơn hàng (đơn)'
            }
        };

        this.barchartTotalOrder = new Chart('myChartTotalOrder', {
            type: 'horizontalBar',
            data: planetData,
            options: chartOptions
        });
    }
    async loadbarchartTotalBill(datachar: any) {
        var Player = [];
        var Run = [];
        //var myChart = null;
        datachar.forEach(x => {
            Player.push(x.nameShop);
            Run.push(x.totalBill);
        });
        if (this.barchartTotalBill != null) {
            this.barchartTotalBill.destroy();
        }
        var ctx = document.getElementById("myChartTotalBill");
        this.barchartTotalBill = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: Player,
                datasets: [{
                    data: Run,
                    label: '# Doanh số',
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    spanGaps: false,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Biểu đồ số doanh số bán hàng (đồng)'
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            callback: function (value, index, values) {
                                return value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ' : ' + tooltipItem.xLabel.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
                        }
                    }
                },
            }
        });
    }


    async onSearch() {
        await this.getData();
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
