import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { FlashSaleTimesService } from '../../services/flashsaletimes.service';
import { ProductService } from '../../services/products.service';
import { PromotionProductsService } from '../../services/promotionproducts.service';
import { PromotionsService } from '../../services/promotions.service';
import * as moment from 'moment';

@Component({
    selector: 'app-promotion-edit',
    templateUrl: './promotion-edit.component.html',
    styleUrls: ['./promotion-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PromotionsEditComponent extends SecondPageEditBase
    implements OnInit {

    total = 0;
    page = 1;
    limit = 100;
    limitAll = 10000;
    cols = [];
    selectedProduct = [];
    results: any;
    key: string;
    flashSaleType: any;
    selectedItems = [];
    isLoading = false;
    type_options = [];
    flashSaleTimes_options = [];
    selectedFlashSaleTimes: number[];
    selectedpromotionNotIns: number[];
    modelEdit: any = {
        idCategory: 1,
    };
    promotions_options = [];

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _PromotionsService: PromotionsService,
        private _ProductService: ProductService,
        private _PromotionProductsService: PromotionProductsService,
        private _FlashSaleTimesService: FlashSaleTimesService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            type: ['', Validators.compose([Validators.required])],
            promotionNotIns: [''],
            name: ['', Validators.compose([Validators.required])],
            startDate: ['', Validators.compose([Validators.required])],
            endDate: ['', Validators.compose([Validators.required])],
            quantity: ['',],
            description: [''],
            fromValue: [''],
            toValue: [''],
            mode: [''],
            sale: ['', Validators.compose([Validators.required, Validators.min(0), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
            numberPerUser: [''],
            numberProductPerUser: [''],
            sort: [''],
            key: [''],
            flashSaleType: [''],
            selectedFlashSaleTimes: [''],
            isActive: [''],
            image: ['']
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
        ];

        this.loadType();
        // await this.loadFlashSaleTimes();
        await this.loadPromotions();
    }

    async loadPromotions() {
        this.promotions_options = [];   // { label: '-- Trạng thái --', value: -1 }
        await this._PromotionsService.GetShort(this.modelEdit.id).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.promotions_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async loadType() {
        this.type_options.push({ label: 'Khuyến mãi theo tổng tiền đơn', value: 1 });
        this.type_options.push({ label: 'Khuyến mãi theo sản phẩm', value: 2 });
        this.type_options.push({ label: 'Khuyến mãi phí ship', value: 5 });
        // this.type_options.push({ label: 'Khuyến mãi Code', value: 3 });
        // this.type_options.push({ label: 'Giảm giá trực tiếp', value: 4 });
    }

    async loadFlashSaleTimes() {
        this.flashSaleTimes_options = [];
        await this._FlashSaleTimesService.Gets('', 0, 1000).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.flashSaleTimes_options.push({ label: item.hour + 'h', value: item.id });
                });
            }
        });
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
        var endDate = new Date(this.modelEdit.endDate);
        var startDate = new Date(this.modelEdit.startDate);
        if (startDate > endDate) {
            this._notifierService.showError("Từ ngày phải nhỏ hơn đến ngày.");
            return false;
        }
        this.modelEdit.startDate = moment(startDate).format('YYYY-MM-DD HH:mm');
        this.modelEdit.endDate = moment(endDate).format('YYYY-MM-DD HH:mm');

        this.modelEdit.promotionProducts = [];
        this.modelEdit.promotionFlashSaleTimes = [];
        this.selectedProduct.forEach(c => {
            this.modelEdit.promotionProducts.push({ idProduct: c.id });
        });
        this.selectedFlashSaleTimes.forEach(c => {
            this.modelEdit.promotionFlashSaleTimes.push({ idFlashSaleTime: c });
        });
        this.modelEdit.promotionNotIns = [];
        if (this.selectedpromotionNotIns != null) {
            this.selectedpromotionNotIns.forEach(element => {
                this.modelEdit.promotionNotIns.push({ idPromotionRef: element });
            });
        }
        // this.modelEdit.promotionProducts = this.selectedProduct;

        this._PromotionsService.post(this.modelEdit).then(rs => {
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

    async showPopup(id: any) {
        this.isShow = true;
        this.selectedProduct = [];
        this.selectedFlashSaleTimes = [];
        if (id > 0) {

            // await this._PromotionsService.GetForEdit(id)
            await this._PromotionsService.getDetail(id)
                .then(async response => {
                    if (response.status) {
                        this.modelEdit = response.data;
                        this.selectedpromotionNotIns = response.data.promotionNotIns.map(x => x.idPromotionRef);
                        await this._PromotionProductsService.getByIdPromotion(this.modelEdit.id).then(rs => {
                            if (rs.status) {
                                this.selectedProduct = rs.data;
                            }
                        });
                        if (this.modelEdit.startDate) {
                            this.modelEdit.startDate = new Date(this.modelEdit.startDate);
                        }
                        if (this.modelEdit.endDate) {
                            this.modelEdit.endDate = new Date(this.modelEdit.endDate);
                        }
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        } else {
            this.selectedpromotionNotIns = [];
            this.modelEdit = {};
        }
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
            this.selectedProduct.push(event);
            event.quantity = 1;
            this.key = null;
        } else {
            this._notifierService.showError('Sản phẩm này đã được chọn');
        }
    }

    onRemove(index: number): void {
        this.selectedProduct.splice(index, 1);
    }

}


