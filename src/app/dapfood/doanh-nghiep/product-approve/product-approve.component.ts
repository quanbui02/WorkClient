import { Component, Injector, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { AdminApproveProductRateComponent } from './admin-approve-product-rate/admin-approve-product-rate.component';
import { ContentViewComponent } from '../product/content/content-view.component';
import { CategoriesService } from '../../services/categories.service';
import { ClientsService } from '../../services/clients.service';
import { AdminApproveCommentComponent } from './admin-approve-comment/admin-approve-comment.component';
import { AdminProductEditComponent } from './admin-product-edit/admin-product-edit.component';

@Component({
    selector: 'app-product-approve',
    templateUrl: './product-approve.component.html',
    styleUrls: ['./product-approve.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminApproveProductComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        idCategory: -1,
        idClient: -1,
        adminApprove: 1
    };
    trangThai_options: any[];
    categories_options: any[];
    clients_options = [];
    colFilter: any = {};

    productInput: any = { KhoId: '-1', SaleId: '-1' };

    @ViewChild(AdminApproveProductRateComponent) _AdminApproveProductRateComponent: AdminApproveProductRateComponent;
    @ViewChild(AdminApproveCommentComponent) _AdminApproveCommentComponent: AdminApproveCommentComponent;
    @ViewChild(AdminProductEditComponent) _ProductEdit: AdminProductEditComponent;
    @ViewChild(ContentViewComponent) _ContentView: ContentViewComponent;

    constructor(
        protected _injector: Injector,
        protected _CategoriesService: CategoriesService,
        private _ClientsService: ClientsService,
        private _ProductService: ProductService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.sortField = 'adminApprove';
        this.trangThai_options = [{ label: '-- Trạng thái --', value: -1 },
        { label: 'Chờ duyệt', value: 1 },
        { label: 'Đã duyệt', value: 2 },
        { label: 'Không duyệt', value: 3 }];

        this.loadTableColumnConfig();
        await this.onLoadCategories();
        await this.onLoadClients();
        await this.getData();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'image',
                header: 'Ảnh đại diện',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'clientName',
                header: 'Doanh nghiệp',
                visible: true,
                align: 'left',
                type: 'clientName',
                sort: true,
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                type: 'name',
                sort: true,
            },
            {
                field: 'clientBalance',
                header: 'Số dư',
                visible: true,
                dataType: 'number',
                type: 'separator',
                align: 'right',
                sort: true,
            },
            {
                field: 'price',
                header: 'Giá sản phẩm',
                dataType: 'number',
                visible: true,
                width: '8%',
                align: 'right',
                type: 'separator',
                sort: true
            },
            {
                field: 'rate',
                header: 'Rate',
                visible: true,
                width: '3%',
                align: 'center',
                type: 'rate',
                sort: true
            },
            {
                field: 'rank',
                header: 'rank',
                visible: true,
                width: '2%',
                align: 'center',
                type: 'rank',
                sort: true
            }
        ];
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }

    async onLoadCategories() {
        this.categories_options = [{ label: '-- Danh mục --', value: -1 }],
            await this._CategoriesService.searchDropdown('', true).then(rs => {
                if (rs.status) {
                    rs.data.forEach(item => {
                        this.categories_options.push(item);
                    });
                } else {
                    this._notifierService.showError(rs.message);
                }
            })
    }

    async onLoadClients() {
        this.clients_options = [{ label: '-- Đơn vị --', value: -1 }];
        await this._ClientsService.GetShort('').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.clients_options.push({ label: item.name, value: item.id });
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
        await this._ProductService.GetsForApprove(
            this.searchModel.key,
            this.searchModel.idCategory,
            this.searchModel.idClient,
            this.searchModel.adminApprove,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
                rs.data.forEach(item => {
                    this.colFilter.tenDot.push({ label: item.tenDot, value: item.tenDot });
                });
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }
    onSearch() {
        this.getData();
    }
    onEdit(id: any) {
        this._ProductEdit.showPopup(id);
    }
    onRate(item: any) {
        this._AdminApproveProductRateComponent.showPopup(item);
    }
    onLink(id: any) {
    }
    onList(id: any) {
        // this._router.navigate(['phe-duyet-ctv', id]);
    }
    onContent(item: any) {
        item.type = 1;
        this._ContentView.showPopup(item.id);
    }
    onAdminApprove(item: any, status: number) {
        this._ProductService.Approved(item.id, status).then(rs => {
            if (rs.status) {
                if (status == 2) {
                    this.getData();
                    this._notifierService.showSuccess('Phê duyệt thành công !');
                }
                if (status == 3) {
                    this._AdminApproveCommentComponent.showPopup(item);
                    this.getData();
                    this._notifierService.showSuccess('Hủy duyệt thành công !');
                }
            } else {
                this._notifierService.showError(rs.message);
            }
        });
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
    onCloseForm(item: any) {
        this.getData();
    }

}
