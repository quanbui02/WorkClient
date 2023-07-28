import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { BannersService } from '../../services/banners.service';
import { BannercategoriesService } from '../../services/bannercategories.service';
import { ProductService } from '../../services/products.service';
import { PromotionUsersService } from '../../services/promotionUsers.service';
import { PromotionsService } from '../../services/promotions.service';
import { FoodsService } from '../../services/foods.service';

@Component({
    selector: 'app-banner-edit',
    templateUrl: './banner-edit.component.html',
    styleUrls: ['./banner-edit.component.scss']
})
export class BannerEditComponent extends SecondPageEditBase
    implements OnInit {

    total = 0;
    page = 1;
    limit = 100;
    limitAll = 10000;
    selectedItems = [];
    isLoading = false;
    cate_options = [];
    results: any;
    key: string;
    modelEdit: any = {
        idCategory: 1,
    };
    // selectedProduct = [];
    selectedProduct: any;
    selectedPromotion: any;
    selectedFood: any;
    type_options = [];

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _BannersService: BannersService,
        private _ProductService: ProductService,
        private _PromotionUsersService: PromotionUsersService,
        private _PromotionsService: PromotionsService,
        private _FoodsService: FoodsService,
        private _bannercategoriesService: BannercategoriesService,
        private messageService: MessageService
    ) {
        super(null, _injector);
    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])],
            image: ['', Validators.compose([Validators.required])],
            imageWeb: [''],
            promotion: [''],
            product: [''],
            food: [''],
            key: [''],
            type: [''],
            url: [''],
            idcategory: [''],
            description: [''],
            isShowHome: [''],
            isActive: [''],
            sort: ['']
        });
        this.loadType();
    }
    async loadType() {
        this.type_options.push({ label: 'Sản phẩm', value: 'product' });
        this.type_options.push({ label: 'Link', value: 'link' });
        this.type_options.push({ label: 'Flash Sales', value: 'promotionUser' });
        this.type_options.push({ label: 'Chương trình thưởng', value: 'promotion' });
        this.type_options.push({ label: 'Món ăn', value: 'food' });
    }
    async loadCate() {
        await this._bannercategoriesService.GetShort().then(rs => {
            if (rs.status) {
                this.cate_options = rs.data;
            }
        });
    }

    save() {
        this._BannersService.post(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isShow = false;
                this.closePopup.emit();
                this.modelEdit = {};
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }
    async autoCompleteProduct(event) {
        const query = event.query;
        await this._ProductService.Autocomplete(
            query,
            (this.page - 1) * this.limit,
            this.limit
        ).then(rs => {
            if (rs.status) {
                this.results = rs.data;
                this.total = rs.totalRecord;
            }
        });
    }
    async autoCompleteFood(event) {
        const query = event.query;
        await this._FoodsService.Autocomplete(
            query,
            (this.page - 1) * this.limit,
            this.limit
        ).then(rs => {
            if (rs.status) {
                this.results = rs.data;
                this.total = rs.totalRecord;
            }
        });
    }
    async autoCompletePromotion(event) {
        const query = event.query;
        if (this.modelEdit.type === 'promotion') {
            await this._PromotionsService.Autocomplete(
                query,
                (this.page - 1) * this.limit,
                this.limit
            ).then(rs => {
                if (rs.status) {
                    this.results = rs.data;
                    this.total = rs.totalRecord;
                }
            });
        } else {
            await this._PromotionUsersService.Autocomplete(
                query,
                (this.page - 1) * this.limit,
                this.limit
            ).then(rs => {
                if (rs.status) {
                    this.results = rs.data;
                    this.total = rs.totalRecord;
                }
            });
        }

    }
    onSelect(event) {
        this.modelEdit.objectId = event.id;
    }
    async showPopup(id: any) {
        this.isShow = true;
        await this.loadCate();

        if (id > 0) {
            await this._BannersService.getDetail(id)
                .then(async response => {
                    if (response.status) {
                        this.modelEdit = response.data;
                        if (this.modelEdit.type === 'product') {
                            this._ProductService.getDetail(this.modelEdit.objectId).then(rs => {
                                if (rs.status) {
                                    this.selectedProduct = rs.data;
                                }
                            });
                        } else if (this.modelEdit.type === 'promotion') {
                            this._PromotionsService.getDetail(this.modelEdit.objectId).then(rs => {
                                if (rs.status) {
                                    this.selectedPromotion = rs.data;
                                }
                            });
                        } else if (this.modelEdit.type === 'promotionUser') {
                            this._PromotionUsersService.getDetail(this.modelEdit.objectId).then(rs => {
                                if (rs.status) {
                                    this.selectedPromotion = rs.data;
                                }
                            });
                        } else if (this.modelEdit.type === 'promotionUser') {
                            this._PromotionUsersService.getDetail(this.modelEdit.objectId).then(rs => {
                                if (rs.status) {
                                    this.selectedPromotion = rs.data;
                                }
                            });
                        }
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        } else {
            this.modelEdit = {};
        }
    }

}


