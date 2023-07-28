import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ShopProductsService } from '../../services/shopProducts.service';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { ClientsService } from '../../services/clients.service';
import { ShopHistoriesComponent } from "../shop-products/shop-histories/shop-histories.component";
import { ShopProductsEditComponent } from "../shop-products/shop-products-edit/shop-products-edit.component";
@Component({
    selector: 'app-shop-products',
    templateUrl: './shop-products.component.html',
    styleUrls: ['./shop-products.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShopProductsComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        trangThai: 0
    };
    ref: DynamicDialogRef;
    trangThai_options: any[];
    colFilter: any = {};
    isActive = true;

    constructor(
        protected _injector: Injector,
        private _ProductService: ShopProductsService,
        private _ClientService: ClientsService,
        public dialogService: DialogService,
        private _UserService: UserService
    ) {
        super(null, _injector);
    }

    @ViewChild(ShopHistoriesComponent) _shopHistories: ShopHistoriesComponent;

    async ngOnInit() {
        const crrUser = await this._UserService.getCurrentUser();

        this.trangThai_options = [{ label: '-- Tình trạng --', value: 0 },
        { label: 'Còn hàng', value: 1 },
        { label: 'Cần nhập', value: -1 }];
        await this.getData();
        this.loadTableColumnConfig();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'image',
                header: 'Ảnh',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'code',
                header: 'Mã',
                visible: true,
                sort: true,
                filterOptions: this.colFilter.tenSanPham
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                sort: true,
                filterOptions: this.colFilter.tenSanPham
            },
            {
                field: 'price',
                header: 'Giá',
                dataType: 'number',
                visible: true,
                align: 'right',
                type: 'separator',
                sort: true
            },
            {
                field: 'quantity',
                header: 'Số lượng kho',
                dataType: 'number',
                visible: true,
                align: 'right',
                type: 'separator',
                sort: true
            },
            {
                field: 'countOrderFinish',
                header: 'Đã xử lý',
                visible: true,
                dataType: 'number',
                align: 'right',
                type: 'separator',
                sort: true
            },
            {
                field: 'countOrderNew',
                header: 'Chờ xử lý',
                dataType: 'number',
                visible: true,
                align: 'center',
                type: 'separator',
                sort: true
            },
            {
                field: 'countOrder',
                header: 'Đang xử lý',
                dataType: 'number',
                visible: true,
                align: 'center',
                type: 'separator',
                sort: true
            }
        ];
    }

    onCheckAll() {
        if (this.ids.length < this.dataSource.length) {
            this.isCheckAll = true;
            this.ids = [];
            for (let i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].checked = true;
                this.ids.push(this.dataSource[i].id);
            }
        } else {
            this.isCheckAll = false;
            this.ids = [];
            for (let i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].checked = false;
            }
        }
        this.isMultiEdit = this.ids.length > 0 ? true : false;
    }

    onViewHistory(item: any) {
        this._shopHistories.showPopup(item);
    }

    initDefaultOption() {
        this.searchModel.key = '';
        this.searchModel.idClient = 0;
    }
    async getData() {
        this.dataSource = [];
        this.isLoading = true;
        await this._ProductService.Gets(
            this.searchModel.key,
            -1,
            this.searchModel.trangThai,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    onSearch() {
        this.getData();
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

    async UpdateDataSource(item: any) {
        if (item) {
            const index = this.dataSource.findIndex(s => s.id === item.id);
            if (index >= 0) {
                await this._ProductService.Gets(item.id, item.idProduct, 0, 0, 1, '').then(rs => {
                    if (rs.status) {
                        this.dataSource[index] = rs.data[0];
                    }
                });
            }
        }
    }

    onUpdateShopProducts(item) {
        this.ref = this.dialogService.open(ShopProductsEditComponent, {
            data: {
                id: item.id,
            },
            header: 'Cập nhật thiết lập sản phẩm',
            width: '50%',
            styleClass: "vs-modal",
            contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
            baseZIndex: 1001,

        });

        this.ref.onClose.subscribe((re: any) => {
            if (re != null) {
                //this.UpdateDataSource(item);
                this.getData();
                this.isLoading = false;
            }
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

    onCloseForm(item) {
        if (item) {
            const index = this.dataSource.findIndex(s => s.id === item.id);
            if (index >= 0) {
                this.dataSource[index].name = item.name;
                this.dataSource[index].image = item.image;
                this.dataSource[index].price = item.price;
                this.dataSource[index].reward = item.reward;
                this.dataSource[index].isActive = item.isActive;
                this.dataSource[index].isAdminApprove = item.isAdminApprove;
                this.dataSource[index].statusApprove = item.statusApprove;
                this.dataSource[index].messageApprove = item.messageApprove;
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

    onActive(item: any, e) {
        const obj = {
            id: item.id,
            IsActived: e.checked
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
