import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ProvincesService } from '../../dapfood/services/provinces.service';
import { Chart } from 'chart.js';
import { ShopsService } from '../../dapfood/services/shops.service';
import { StatisticsService } from '../statistic.service';

@Component({
    selector: 'app-thong-ke-don-hang-theo-kenh-thanh-toan',
    templateUrl: './thong-ke-don-hang-theo-kenh-thanh-toan.component.html',
    styleUrls: ['./thong-ke-don-hang-theo-kenh-thanh-toan.component.scss']
})
export class ThongKeDonHangTheoKenhThanhToanComponent extends SecondPageIndexBase implements OnInit {

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
        await this._StatisticsService.Report_chart_Order_PaymentChannel(
            this.searchModel.dateType
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
        var Run = [];
        datachar.forEach(x => {
            Player.push(x.paymentChannel);
            Run.push(x.thanhCong);

        });
        if (this.barchartTotalBill != null) {
            this.barchartTotalBill.destroy();
        }

        var planetData = {
            labels: Player,
            datasets: [{
                data: Run,
                label: '# Đơn hàng',
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(254, 176, 175)',
                    'rgb(249, 0, 0)',
                    'rgb(187, 255, 51)',
                    'rgb(26, 178, 255)',
                    'rgb(102, 0, 0)',
                    'rgb(179, 119, 0)'
                ],
            }],
        };
        if (this.barchartTotalOrder != null) {
            this.barchartTotalOrder.destroy();
        }
        var chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Biểu đồ số đơn hàng (đơn)'
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        //get the concerned dataset
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        //calculate the total of this data set
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        //get the current items value
                        var currentValue = dataset.data[tooltipItem.index];
                        //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                        var percentage = Math.floor(((currentValue / total) * 100) + 0.5);

                        return currentValue + " Đơn" + " (" + percentage + "%)";
                    }
                }
            }
        };

        this.barchartTotalOrder = new Chart('myChartTotalOrder', {
            type: 'doughnut',
            data: planetData,
            options: chartOptions
        });
    }

    async loadbarchartTotalBill(datachar: any) {
        var Player = [];
        var Run = [];
        datachar.forEach(x => {
            Player.push(x.paymentChannel);
            Run.push(x.totalBill);

        });
        if (this.barchartTotalBill != null) {
            this.barchartTotalBill.destroy();
        }
        var ctx = document.getElementById("myChartTotalBill");
        this.barchartTotalBill = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Player,
                datasets: [{
                    data: Run,
                    label: '# Doanh số',
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(254, 176, 175)',
                        'rgb(249, 0, 0)',
                        'rgb(187, 255, 51)',
                        'rgb(26, 178, 255)',
                        'rgb(102, 0, 0)',
                        'rgb(179, 119, 0)'
                    ],
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Biểu đồ số doanh số bán hàng (đồng)'
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            //get the concerned dataset
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            //calculate the total of this data set
                            var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                return previousValue + currentValue;
                            });
                            //get the current items value
                            var currentValue = dataset.data[tooltipItem.index];
                            //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
                            var percentage = Math.floor(((currentValue / total) * 100) + 0.5);

                            return currentValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) + " (" + percentage + "%)";
                        }
                    }
                }
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
