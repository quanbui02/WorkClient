import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ReportService } from '../report.service';
import { ProvincesService } from '../../dapfood/services/provinces.service';
import { ShopsService } from '../../dapfood/services/shops.service';

@Component({
    selector: 'app-bao-cao-ton-kho-cua-hang',
    templateUrl: './bao-cao-ton-kho-cua-hang.component.html',
    styleUrls: ['./bao-cao-ton-kho-cua-hang.component.scss']
})
export class BaoCaoTonKhoCuaHangComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        idProvince: -1,
        idShop: -1,
    };
    list_units = [];
    list_shops = [];
    colFilter: any = {};
    disabled = false;
    openSearchAdv = true;
    vi: any;

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
        this.cols = [
            {
                field: 'id',
                header: 'Mã',
                visible: true,
                align: 'center',
                width: '70px',
            },
            {
                field: 'shopName',
                header: 'Tên cửa hàng',
                visible: true,
                align: 'left',
                width: '350px',
            },
            {
                field: 'shopCode',
                header: 'Mã cửa hàng',
                visible: true,
                align: 'left',
            },
            {
                field: 'productName',
                header: 'Tên sản phẩm',
                visible: true,
                align: 'left',
                width: '350px',
            },
            {
                field: 'productCode',
                header: 'Mã sản phẩm',
                visible: true,
                align: 'left',
            },
            {
                field: 'quantity',
                header: 'Số lượng',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'updatedDate',
                header: 'Ngày cập nhật',
                visible: true,
                align: 'left',
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                align: 'left',
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
        await this._ReportService.Report_BaoCaoTonKhoCuaHang(
            this.searchModel.idProvince,
            this.searchModel.idShop,
            this.sortField,
            this.isAsc
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
