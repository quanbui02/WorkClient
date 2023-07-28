import { Component, Injector, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ProductEditComponent } from '../../dapfood/doanh-nghiep/product/edit/product-edit.component';
import { ProductService } from '../../dapfood/services/products.service';
import { ReportService } from '../report.service';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ClientsService } from '../../dapfood/services/clients.service';

@Component({
    selector: 'app-thong-ke-theo-san-pham',
    templateUrl: './thong-ke-theo-san-pham.component.html',
    styleUrls: ['./thong-ke-theo-san-pham.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ThongKeTheoSanPhamComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        idClient: -1,
        fromDate: new Date(),
        toDate: new Date(),
        adminApprove: 1
    };
    trangThai_options: any[];
    clients_options = [];
    colFilter: any = {};
    vi: any;

    productInput: any = { KhoId: '-1', SaleId: '-1' };

    @ViewChild(ProductEditComponent) _ProductEdit: ProductEditComponent;

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _ClientsService: ClientsService,
        protected __ReportService: ReportService,
        private _ProductService: ProductService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.searchModel.fromDate.setDate(this.searchModel.fromDate.getDate() - 30);

        this.sortField = 'adminApprove';
        this.trangThai_options = [{ label: '-- Trạng thái --', value: -1 },
        { label: 'Chưa duyệt', value: 0 },
        { label: 'Đã duyệt', value: 1 }];
        this.loadTableColumnConfig();
        await this.loadClients()
        await this.getData();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'image',
                header: 'Ảnh đại diện',
                visible: false,
                align: 'center',
                width: '10%',
                sort: false,
            },
            {
                field: 'code',
                header: 'Mã',
                visible: true,
                width: '5%',
                sort: true
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                sort: true
            },
            {
                field: 'price',
                header: 'Giá sản phẩm',
                dataType: 'number',
                visible: true,
                width: '8%',
                align: 'right',
                sort: true
            },
            {
                field: 'soSanPhamDaBan',
                header: 'Số sản phẩm đã bán',
                visible: true,
                width: '8%',
                align: 'center',
                sort: true
            },
            {
                field: 'isActive',
                header: 'Trạng thái',
                visible: false,
                align: 'center',
                width: '5%',
                sort: true
            },
            {
                field: 'isAdminApprove',
                header: 'Trạng thái duyệt',
                visible: false,
                align: 'center',
                width: '5%',
                sort: true
            },
        ];
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }

    async loadClients() {
        this.clients_options = [{ label: '-- Đơn vị --', value: -1 }];
        await this._ClientsService.GetShort('').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.clients_options.push({ label: item.name, value: item.id });
                    this.searchModel.idClient = item.id;
                });
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    async getData() {
        this.dataSource = [];
        this.isLoading = true;
        this.colFilter.tenDot = [];
        await this.__ReportService.Products(
            this.searchModel.key,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            this.searchModel.idClient,
            1,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.dataTotal = [rs.dataTotal];
                this.total = rs.totalRecord;
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        console.log(159, this.dataSource.values);
        this.resetBulkSelect();
        this.isLoading = false;
    }

    onSearch() {
        this.getData();
    }

    onEdit(id: any) {
        this._ProductEdit.showPopup(id);
    }

    onLink(id: any) {
    }

    onList(id: any) {
        // this._router.navigate(['phe-duyet-ctv', id]);
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
    onCloseForm(item: any) {
        // this.getData();
    }

}


