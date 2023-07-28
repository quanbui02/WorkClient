import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ProductEditComponent } from './edit/product-edit.component';
import { ProductService } from '../../services/products.service';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { ContentEditComponent } from './content/content-edit.component';
import { ProductViewComponent } from './view/product-view.component';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { ClientsService } from '../../services/clients.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProductComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        trangThai: -1,
        active: 1
    };
    ref: DynamicDialogRef;
    //checkedps = false;
    tokenps = '';
    idps = 0;
    active_options: any[];
    trangThai_options: any[];
    colFilter: any = {};
    //countUnapproved = 0;
    viewType = 'item';
    productInput: any = { KhoId: '-1', SaleId: '-1' };
    // objPartnerClients: any = {};
    hideGuide = false;
    guideUrl = '';
    guideImgUrl = '';
    guideTitle = 'Hướng dẫn';
    guideType = 1;
    sizeMedium = 'medium';
    //objDNData: any = {};
    isActive = true;

    @ViewChild(ProductEditComponent) _ProductEdit: ProductEditComponent;
    @ViewChild(ContentEditComponent) _ContentEdit: ContentEditComponent;
    @ViewChild(ProductViewComponent) _ProductView: ProductViewComponent;

    constructor(
        protected _injector: Injector,
        private _ProductService: ProductService,
        private _ClientService: ClientsService,
        public dialogService: DialogService,
        private _UserService: UserService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        const crrUser = await this._UserService.getCurrentUser();
        if (crrUser) {
            if (crrUser.idClient) {
                this.searchModel.idClient = crrUser.idClient;
            } else { return; }
        } else { return; }
        this.trangThai_options = [{ label: '-- Trạng thái duyệt --', value: -1 },
        { label: 'Chờ duyệt', value: 1 },
        { label: 'Đã duyệt', value: 2 },
        { label: 'Không duyệt', value: 3 }];

        // // await this.onLoadNamHoc();
        // this._ReportService.GetDashboardDN().then(rs => {
        //     if (rs.status) {
        //         this.objDNData = rs.data;
        //     }
        // });
        // await this.LoadInfo();
        await this.loadActiveOptions();
        await this.getData();
        this.loadTableColumnConfig();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'code',
                header: 'Mã',
                width: '5%',
                visible: true,
                sort: true
            },
            {
                field: 'image',
                header: 'Ảnh',
                visible: true,
                align: 'center',
                width: '7%',
                sort: true,
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                sort: true,
                filterOptions: this.colFilter.tenSanPham
            },
            {
                field: 'type',
                header: 'Loại',
                visible: true,
                sort: true,
                width: '6%',
                filterOptions: this.colFilter.type
            },
            {
                field: 'provinceProduct',
                header: 'Bán tại',
                visible: true,
                sort: true,
                filterOptions: this.colFilter.tenSanPham
            },
            {
                field: 'price',
                header: 'Giá',
                dataType: 'number',
                visible: true,
                width: '5%',
                align: 'right',
                type: 'separator',
                sort: true
            },
            {
                field: 'reward',
                header: 'Hoa hồng',
                dataType: 'number',
                visible: true,
                width: '5%',
                align: 'right',
                type: 'separator',
                sort: true
            },
            {
                field: 'isSoldOut',
                header: 'Trạng thái hết hàng',
                dataType: 'number',
                visible: true,
                width: '5%',
                align: 'center',
                type: 'separator',
                sort: true
            },
            {
                field: 'isActive',
                header: 'Trạng thái sử dụng',
                dataType: 'number',
                visible: true,
                width: '5%',
                align: 'center',
                type: 'separator',
                sort: true
            },
            // {
            //     field: 'isAdminApprove',
            //     header: 'Trạng thái duyệt',
            //     dataType: 'number',
            //     visible: true,
            //     width: '8%',
            //     align: 'center',
            //     type: 'separator',
            //     sort: true
            // },
            // {
            //     field: 'messageApprove',
            //     header: 'Ghi chú',
            //     dataType: 'number',
            //     visible: true,
            //     type: 'separator',
            //     sort: true
            // }
        ];
    }

    async loadActiveOptions() {
        this.active_options = [{ label: '-- Trạng thái --', value: -1 }];
        this.active_options.push({ label: 'Không sử dụng', value: 0 });
        this.active_options.push({ label: 'Sử dụng', value: 1 });
    }

    initDefaultOption() {
        this.searchModel.key = '';
        this.searchModel.idClient = 0;
    }
    async getData() {
        this.dataSource = [];
        this.isLoading = true;
        this.colFilter.tenDot = [];
        //this.countUnapproved = 0;
        await this._ProductService.GetsByIdClient(
            this.searchModel.key,
            this.searchModel.trangThai,
            this.searchModel.active,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
                // rs.data.forEach(item => {
                //     if (item.countUnapproved) {
                //         this.countUnapproved += item.countUnapproved;
                //     }
                // });
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    ShowName(province) {
        var name = '';
        if (province && province.length > 0) {
            province.forEach(item => {
                name += item.provinceName + ', ';
            })
        }
        return name;
    }

    onSearch() {
        this.getData();
    }
    onContent(item: any) {
        item.type = 1;
        this._ContentEdit.showPopup(item);
    }
    onEdit(item: any) {
        if (this.isActive) {
            this._ProductEdit.showPopup(item);
        }
        else {
            this._notifierService.showError("Vui lòng kết nối hệ thống vận hành DapFood");
        }
    }

    onList(id: any) {
        this._router.navigate(['phe-duyet-ctv', id]);
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Bạn có chắc chắn muốn xóa sản phẩm này?', 'Xóa sản phẩm').then(rs => {
            this._ProductService.delete(id).then(re => {
                if (re.status) {
                    this._notifierService.showDeleteDataSuccess();
                    this.getData();
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
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

    onUpdateCount(item) {
        if (item) {
            const index = this.dataSource.findIndex(s => s.id === item.idProduct);
            if (index >= 0) {
                this.dataSource[index].countUnapproved = item.countUnapproved;
            }
        }
    }

    async onCloseForm(item) {
        if (item) {
            const index = this.dataSource.findIndex(s => s.id === item.id);
            if (index >= 0) {
                await this._ProductService.GetsByIdClient(
                    item.id,
                    -1,
                    -1,
                    0,
                    1,
                    ''
                ).then(rs => {
                    if (rs.status) {
                        this.dataSource[index] = rs.data[0];
                    }
                });
            } else {
                this.getData();
            }
        }
    }

    formatNumber(i): string {
        try {
            const t = +i.toFixed(2);
            return (t).toLocaleString('vi-vn', { minimumFractionDigits: 0 });
        } catch {
            return '0';
        }
    }

    onView(item: any) {
        this._ProductView.showPopup(item);
    }

    IsSoldOut(item: any, e) {
        const obj = {
            id: item.id,
            IsSoldOut: e.checked
        };
        this._ProductService.IsSoldOut(obj).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
            } else {
                this._notifierService.showError(rs.message);
            }
            this.isLoading = false;
        });
    }

    IsActive(item: any, e) {
        const obj = {
            id: item.id,
            isActive: e.checked
        };
        this._ProductService.IsActive(obj).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
            } else {
                this._notifierService.showError(rs.message);
            }
            this.isLoading = false;
        });
    }

}
