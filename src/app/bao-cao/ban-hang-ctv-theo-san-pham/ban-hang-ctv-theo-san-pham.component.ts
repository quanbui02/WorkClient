import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ReportService } from '../report.service';

@Component({
    selector: 'ban-hang-ctv-theo-san-pham',
    templateUrl: './ban-hang-ctv-theo-san-pham.component.html',
    styleUrls: ['./ban-hang-ctv-theo-san-pham.component.scss']
})
export class BanHangCTVTheoSanPhamComponent extends SecondPageIndexBase implements OnInit {

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
                field: 'idProduct',
                header: 'Mã sản phẩm',
                visible: true,
                align: 'center',
                width: '70px',
            },
            {
                field: 'nameProduct',
                header: 'Tên sản phẩm',
                visible: true,
                align: 'left',
                width: '350px',
            },
            {
                field: 'nameCustomer',
                header: 'Khách mua',
                visible: true,
                align: 'left',
            },
            {
                field: 'countOrder',
                header: 'Tổng số đơn',
                visible: true,
                align: 'right',
                width: '8%',
            },
            {
                field: 'priceProduct',
                header: 'Đơn giá',
                visible: true,
                align: 'right',
                width: '8%',
            },
            {
                field: 'quantity',
                header: 'Số lượng',
                visible: true,
                align: 'right',
                width: '8%',
            },
            {
                field: 'priceOrder',
                header: 'Tổng tiền',
                visible: true,
                align: 'right',
                width: '8%',
            },
            {
                field: 'rewardOrder',
                header: 'Tổng hoa hồng',
                visible: true,
                align: 'right',
                width: '8%',
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
        await this._ReportService.Report_BaoCaoBanHangCTVTheoSanPham(
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
        //this.dataSource = [...this.dataSource];
    }

    onCloseForm() {
        this.getData();
    }

}
