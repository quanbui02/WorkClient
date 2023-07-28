import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';
import { ProductService } from '../../services/products.service';
import { PromotionUserProductsService } from '../../services/promotionUserProducts.service';
import { PromotionUsersGiftProductsService } from '../../services/promotionUsersGiftProducts.service';
import { PromotionUsersService } from '../../services/promotionUsers.service';
import { UserService } from '../../../lib-shared/services/user.service';
import { CategoriesService } from '../../services/categories.service';
import { SuppliersService } from '../../services/suppliers.service';
import { ClientsService } from '../../services/clients.service';
import { LevelsService } from '../../services/levels.service';

@Component({
    selector: 'app-promotionUsers-edit',
    templateUrl: './promotionUser-edit.component.html',
    styleUrls: ['./promotionUser-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PromotionUsersEditComponent extends SecondPageEditBase
    implements OnInit {

    total = 0;
    page = 1;
    limit = 100;
    limitAll = 10000;
    cols = [];
    colsGift = [];
    selectedProduct = [];
    results: any;
    key: string;
    resultsGift: any;
    keyGift: string;
    selectedProductGift = [];
    flashSaleType: any;
    selectedItemsGift = [];
    isLoading = false;
    type_options = [];
    payment_options = [];
    flashSaleTimes_options = [];
    quantityType_options = [];
    selectedFlashSaleTimes: number[];
    selectedpromotionNotIns: number[];
    category_options = [];
    category1_options = [];
    supplier_options = [];
    client_options = [];
    level_options = [];
    kol_options = [];
    codeUpdate_options = [];
    modelEdit: any = {
        idCategory: 1,
        paymentMethod: -1,
    };
    promotions_options = [];

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _PromotionUsersService: PromotionUsersService,
        private _configurationService: ConfigurationService,
        private _ProductService: ProductService,
        private _UserService: UserService,
        private _PromotionUserProductsService: PromotionUserProductsService,
        private _PromotionUsersGiftProductsService: PromotionUsersGiftProductsService,
        private _CategoriesService: CategoriesService,
        private _SuppliersService: SuppliersService,
        private _ClientsService: ClientsService,
        private _LevelsService: LevelsService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.formGroup = this.formBuilder.group({
            type: ['', Validators.compose([Validators.required])],
            promotionUserNotIns: [''],
            name: ['', Validators.compose([Validators.required])],
            startDate: ['', Validators.compose([Validators.required])],
            endDate: ['', Validators.compose([Validators.required])],
            quantity: ['',],
            description: [''],
            shortDescription: [''],
            fromValue: [''],
            toValue: [''],
            mode: [''],
            maxSale: ['', Validators.compose([Validators.min(0), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
            quantityProduct: ['', Validators.compose([Validators.min(0), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
            quantityMust: [''],
            quantityType: [''],
            quantityGift: [''],
            sale: ['', Validators.compose([Validators.required, Validators.min(0), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
            paymentMethod: [-1],
            numberPerUser: [''],
            numberProductPerUser: [''],
            sort: [''],
            key: [''],
            keyGift: [''],
            gift: [''],
            isActive: [''],
            image: [''],
            imageWeb: [''],
            codeUpdate: [''],
            referralUserId: [''],
            isFirstOrderUser: [''],
            idCategory: [''],
            idCategory1: [''],
            idSupplier: [''],
            idClient: [''],
            idLevel: [''],
            startDateReward: [''],
            endDateReward: [''],
        });

        this.cols = [
            {
                field: 'code',
                header: 'Mã',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                width: '50%',
                sort: true
            },
            {
                field: 'quantityMust',
                header: 'Số lượng cần',
                visible: true,
                width: '30%',
                sort: true
            }
        ];

        this.colsGift = [
            {
                field: 'code',
                header: 'Mã',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                width: '50%',
                sort: true
            },
            {
                field: 'quantityGift',
                header: 'Số lượng',
                visible: true,
                width: '30%',
                sort: true
            }
        ];

        await this.loadType();
        await this.loadPayment();
        await this.loadKol();
        await this.loadSuppliers();
        await this.loadClients();
        await this.loadLevels();
        await this.loadCategories();
        await this.loadCategories1();
    }

    async loadPromotions() {
        this.promotions_options = [];   // { label: '-- Trạng thái --', value: -1 }
        await this._PromotionUsersService.GetShort(this.modelEdit.id).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.promotions_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadSuppliers() {
        this.supplier_options = [];   // { label: '-- Trạng thái --', value: -1 }
        await this._SuppliersService.GetShort('', 0).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.supplier_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadClients() {
        this.client_options = [];   // { label: '-- Trạng thái --', value: -1 }
        await this._ClientsService.GetShort('').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.client_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadLevels() {
        this.level_options = [];   // { label: '-- Trạng thái --', value: -1 }
        await this._LevelsService.GetShort('').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.level_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadCategories() {
        this.category_options = [];
        await this._CategoriesService.GetShort(0, '').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.category_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadCategories1() {
        this.category1_options = [];
        if (this.modelEdit.idCategory > 0) {
            await this._CategoriesService.GetShort(this.modelEdit.idCategory, '').then(rs => {
                if (rs.status) {
                    rs.data.forEach(item => {
                        this.category1_options.push({ label: item.name, value: item.id });
                    });
                }
            });
        }
    }

    async loadType() {
        this.type_options.push({ label: 'Khuyến mãi theo tổng tiền đơn', value: 1 });
        this.type_options.push({ label: 'Khuyến mãi theo sản phẩm', value: 2 });
        this.type_options.push({ label: 'Khuyến mãi phí ship', value: 5 });
        this.type_options.push({ label: 'Khuyến mãi giới thiệu', value: 6 });
        this.type_options.push({ label: 'Khuyến mãi Code', value: 3 });
        this.type_options.push({ label: 'Khuyến mãi tích lũy', value: 7 });
        // this.type_options.push({ label: 'Giảm giá trực tiếp', value: 4 });

        this.codeUpdate_options.push({ label: 'Chỉ cập nhật thông tin', value: 0 });
        this.codeUpdate_options.push({ label: 'Tạo mã mới hoàn toàn', value: 1 });
        this.codeUpdate_options.push({ label: 'Cập nhật số lượng, giữ mã đã dùng', value: 2 });

        this.quantityType_options.push({ label: 'Tùy chọn', value: 0 });
        this.quantityType_options.push({ label: 'Bắt buộc', value: 1 });
    }

    async loadKol() {
        this.kol_options = [{ label: '-- Không chọn Kol --', value: "" }];
        await this._UserService.GetsListKOL("").then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.kol_options.push({ label: item.userName + "(" + item.name + ")", value: item.userId });
                });
            }
        });
    }

    async loadPayment() {
        this.payment_options.push({ label: 'Tiền mặt', value: 0 });
        // this.payment_options.push({ label: 'Ví bapi', value: 1 });
        this.payment_options.push({ label: 'Momo', value: 2 });
        this.payment_options.push({ label: 'Zalo pay', value: 3 });
        this.payment_options.push({ label: 'VNPay', value: 4 });
    }

    async loadFlashSaleTimes() {
    }

    save() {
        if (this.modelEdit.type == 1 && !this.modelEdit.fromValue) {
            this._notifierService.showError("Nhập giá trị từ");
            return false;
        }
        if (this.modelEdit.type == 2 && (!this.selectedProduct || this.selectedProduct.length <= 0)) {
            this._notifierService.showError("Thêm sản phẩm");
            return false;
        }
        if (!this.modelEdit.mode) {
            this._notifierService.showError("Chọn loại thưởng");
            return false;
        }
        if (!this.modelEdit.sale || this.modelEdit.sale <= 0) {
            this._notifierService.showError("Nhập giá trị thưởng");
            return false;
        }
        if (this.modelEdit.mode == 2) {
            this.modelEdit.maxSale = this.modelEdit.sale;
        }
        var endDate = new Date(this.modelEdit.endDate);
        var startDate = new Date(this.modelEdit.startDate);
        // var today = new Date();
        // if (this.modelEdit.endDate && this.modelEdit.id <= 0) {
        //     today.setHours(0, 0, 0, 0);
        //     if (startDate < today) {
        //         this._notifierService.showError("Từ ngày phải lớn hơn hôm nay");
        //         return false;
        //     }
        // }
        if (startDate > endDate) {
            this._notifierService.showError("Từ ngày phải nhỏ hơn đến ngày.");
            return false;
        }
        this.modelEdit.startDate = moment(startDate).format('YYYY-MM-DD 00:00');
        this.modelEdit.endDate = moment(endDate).format('YYYY-MM-DD 00:00');
        this.modelEdit.promotionUserProducts = [];
        this.selectedProduct.forEach(c => {
            this.modelEdit.promotionUserProducts.push({ idProduct: c.id, quantityMust: c.quantityMust });
        });
        this.modelEdit.promotionUsersGiftProducts = [];
        this.selectedProductGift.forEach(c => {
            this.modelEdit.promotionUsersGiftProducts.push({ idProduct: c.id, quantity: c.quantityGift, isActive: true });
        });
        this.modelEdit.promotionUserNotIns = [];
        if (this.selectedpromotionNotIns != null) {
            this.selectedpromotionNotIns.forEach(element => {
                this.modelEdit.promotionUserNotIns.push({ idPromotionUserRef: element });
            });
        }
        // this.modelEdit.promotionProducts = this.selectedProduct;
        this.modelEdit.maxValue = this.modelEdit.maxSale;
        this._PromotionUsersService.post(this.modelEdit).then(rs => {
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

    addHours(numOfHours, date = new Date()) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

        return date;
    }

    async showPopup(id: any) {
        this.isShow = true;
        this.selectedProduct = [];
        this.selectedProductGift = [];
        this.selectedFlashSaleTimes = [];
        if (id > 0) {
            await this._PromotionUsersService.getDetail(id)
                .then(async response => {
                    if (response.status) {
                        this.modelEdit = response.data;
                        this.selectedpromotionNotIns = response.data.promotionUserNotIns.map(x => x.idPromotionUserRef);
                        await this._PromotionUserProductsService.getByIdPromotion(this.modelEdit.id).then(rs => {
                            if (rs.status) {
                                this.selectedProduct = rs.data;
                            }
                        });
                        await this._PromotionUsersGiftProductsService.getByIdPromotion(this.modelEdit.id).then(rs2 => {
                            if (rs2.status) {
                                this.selectedProductGift = rs2.data;
                            }
                        });
                        if (this.modelEdit.startDate) {
                            this.modelEdit.startDate = this.addHours(-7, new Date(this.modelEdit.startDate));
                        }
                        if (this.modelEdit.endDate) {
                            this.modelEdit.endDate = this.addHours(-7, new Date(this.modelEdit.endDate));;
                        }
                        if (this.modelEdit.idCategory) {
                            this.loadCategories1();
                        }
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        } else {
            this.selectedpromotionNotIns = [];
            this.modelEdit = { id: 0 };
        }
        await this.loadPromotions();
    }

    async autoComplete(event) {
        const query = event.query;
        let ids = '';
        if (this.selectedProduct != null) {
            ids = this.selectedProduct.map((obj) => obj.id).toString();
        }
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

    onSelect(event) {
        if (this.selectedProduct.findIndex(rs => rs.id === event.id) < 0) {
            event.quantityMust = 0;
            this.selectedProduct.push(event);
            this.key = null;
        } else {
            this._notifierService.showError('Sản phẩm này đã được chọn');
        }
    }

    onRemove(index: number): void {
        this.selectedProduct.splice(index, 1);
    }

    async autoCompleteGift(event) {
        const query = event.query;
        let ids = '';
        if (this.selectedProductGift != null) {
            ids = this.selectedProductGift.map((obj) => obj.id).toString();
        }
        await this._ProductService.Autocomplete(
            query,
            (this.page - 1) * this.limit,
            this.limit
        ).then(rs => {
            if (rs.status) {
                this.resultsGift = rs.data;
                this.total = rs.totalRecord;
            }
        });
    }

    onSelectGift(event) {
        if (this.selectedProductGift.findIndex(rs => rs.id === event.id) < 0) {
            event.quantityGift = 1;
            this.selectedProductGift.push(event);

            this.keyGift = null;
        } else {
            this._notifierService.showError('Sản phẩm này đã được chọn');
        }
    }

    onRemoveGift(index: number): void {
        this.selectedProductGift.splice(index, 1);
    }

}


