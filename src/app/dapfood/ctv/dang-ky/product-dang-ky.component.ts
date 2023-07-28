import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { ProductRegService } from '../../services/productregs.service';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { CategoriesService } from '../../services/categories.service';
import { ContentViewComponent } from '../../doanh-nghiep/product/content/content-view.component';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'app-product-dang-ky',
    templateUrl: './product-dang-ky.component.html',
    styleUrls: ['./product-dang-ky.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProductDangKyComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        danhMuc: '',
        idCategory: 0,
        idClient: 0,
        brand: 0,
        trangThai: -1
    };
    regsInfo: any = {};
    colFilter: any = {};
    status: number;
    idExpanded = -1;
    categories_options: any[];

    categories: SelectItem[];
    selectedCategories = [];
    cars: SelectItem[];
    @ViewChild(ContentViewComponent) _NoiDungQuangCaoViewComponent: ContentViewComponent;

    constructor(
        protected _injector: Injector,
        private _ProductService: ProductService,
        private _CategoriesService: CategoriesService,
        private _ProductRegService: ProductRegService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        // this.trangThai_options = [{ label: '-- Trạng thái --', value: -1 },
        // { label: 'Chờ duyệt', value: 0 },
        // { label: 'Đã duyệt', value: 1 }];
        //this._CategoriesService.searchDropdown('').then(rs => this.categories = <SelectItem[]>rs.data);
        this.loadTableColumnConfig();
        await this.onLoadCategories();
        await this.getData();
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
            // {
            //     field: 'clientName',
            //     header: 'Doanh nghiệp',
            //     visible: true,
            //     align: 'left',
            //     type: 'clientName',
            //     sort: true,
            // },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                type: 'name',
                sort: true,
                filterOptions: this.colFilter.tenSanPham
            },
            {
                field: 'price',
                header: 'Giá',
                dataType: 'number',
                visible: true,
                width: '8%',
                align: 'right',
                type: 'separator',
                sort: true
            },
            {
                field: 'reward',
                header: 'Hoa hồng',
                visible: true,
                width: '10%',
                align: 'center',
                type: 'separator',
                sort: true
            },
        ];
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

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        this.colFilter.tenDot = [];
        if (this.selectedCategories.length > 0) {
            this.searchModel.danhMuc = ';' + this.selectedCategories.map(x => x.value).join(';') + ';';
        } else {
            this.searchModel.danhMuc = '';
        }
        await this._ProductService.Search(
            this.searchModel.key,
            this.searchModel.idCategory,
            this.searchModel.brand,
            this.searchModel.idclient,
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

    onViewImage() {
    }

    copyLink(text: string) {
        // this._clipboardService.copyFromContent(text);
        console.log(187, text);
    }
    copied() {
        this._notifierService.showSuccess('Copy thành công!');
    }
    showLevel() {

    }
    formatChietKhau(item: any): string {
        if (item.level0) {
            if (item.level0 == 0) {
                return '';
            } else {
                if (item.levelMax > item.level0) {
                    return item.level0 + '% - ' + item.levelMax + '%';
                } else {
                    return item.level0 + '%';
                }
            }
        } else {
            return '';
        }
    }

    onViewNoiDung(data: any) {
        this._NoiDungQuangCaoViewComponent.showPopup(data);
    }

    AddFavorite(item: any) {
        this._ProductRegService.AddFavorite(item.id).then(rs => {
            if (rs.status) {
                item.isFavorite = rs.data.isFavorite;
                if (item.isFavorite)
                    this._notifierService.showSuccess('Đã thêm vào kho của tôi !');
                else
                    this._notifierService.showSuccess('Đã xóa khỏi kho của tôi !');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
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
    }

}
