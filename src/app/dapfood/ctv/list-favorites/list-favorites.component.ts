import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ProductService } from '../../services/products.service';
import { TreeNode, SelectItem } from 'primeng/api';
import { ProductRegService } from '../../services/productregs.service';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { CategoriesService } from '../../services/categories.service';
import { UserService } from '../../../lib-shared/services/user.service';
import { User } from '../../../lib-shared/models/user';
import { ContentEditComponent } from '../../doanh-nghiep/product/content/content-edit.component';
import { ContentViewComponent } from '../../doanh-nghiep/product/content/content-view.component';

@Component({
    selector: 'app-list-favorites',
    templateUrl: './list-favorites.component.html',
    styleUrls: ['./list-favorites.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ListFavoritesComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        cate: 0,
        trangThai: -1
    };
    regsInfo: any = {};
    colFilter: any = {};
    status: number;
    idExpanded = -1;
    // trangThai_options: any[];

    categories: SelectItem[];
    selectedCategories = [];
    cars: SelectItem[];
    @ViewChild(ContentViewComponent) _ContentView: ContentViewComponent;
    crrUser: User;
    constructor(
        protected _injector: Injector,
        private _UserService: UserService,
        private _CategoriesService: CategoriesService,
        private _ProductRegService: ProductRegService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.crrUser = await this._UserService.getCurrentUser();
        this._CategoriesService.searchDropdown('').then(rs => this.categories = <SelectItem[]>rs.data);

        this.loadTableColumnConfig();
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
            {
                field: 'link',
                header: 'Link affiliate',
                visible: true,
                width: '10%',
                align: 'center',
                type: 'separator',
                sort: true
            },
            {
                field: 'content',
                header: 'Nội dung',
                visible: true,
                width: '10%',
                align: 'center',
                type: 'separator',
                sort: true
            },
        ];
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._ProductRegService.MyProducts(
            this.searchModel.key,
            this.searchModel.cate,
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
            if (item.level0 === 0) {
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

    // onEditNoiDung(data: any) {
    //     let type = 2;
    //     if (data.idClient) {
    //         if (data.idClient === this.crrUser.idClient) {
    //             type = 1;
    //         }
    //     }
    //     const obj = { id: data.id, type: type };
    //     this._NoiDungQuangCaoEditComponent.showPopup(obj);
    // }

    onContent(item: any) {
        item.type = 1;
        this._ContentView.showPopup(item.id);
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
