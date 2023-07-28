import { Component, Injector, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { DialogService, DynamicDialogRef, TreeNode } from 'primeng/api';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { CategoriesService } from '../../../services/categories.service';
import { ProductService } from '../../../services/products.service';
import { UserService } from '../../../../lib-shared/services/user.service';
import { async } from '@angular/core/testing';
import { BrandsService } from '../../../services/brands.service';
import { SuppliersService } from '../../../services/suppliers.service';
import { CountriesService } from '../../../services/countries.service';
import { ProvincesService } from '../../../services/provinces.service';

@Component({
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent extends SecondPageEditBase
    implements OnInit {
    total = 0;
    page = 1;
    limit = 100;
    results: any;
    cols: any;
    key: string;
    categories: TreeNode[];
    ref: DynamicDialogRef;
    selectedProduct = [];
    selectedCategories: TreeNode[] = [];
    type_options: any[];
    cate_options: any[];
    cate1_options: any[];
    cate2_options: any[];
    dropdownBrands: any[];
    dropdownSuppliers: any[];
    dropdowncountries: any[];
    province_options: any[] = [];
    productProvinces: any[] = [];
    productProvinceCity: any[] = [];
    modelEdit: any = {
        type: 1,
        idCategory: 0,
        idCategory1: 0,
        idCategory2: 0,
        level0: 0,
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 0,
        level5: 0,
        isActive: true,
        productProvince: [],
    };
    listImage: any[] = [];
    dataSource = [];
    userId = 0;
    hideHtml = true;

    @ViewChild('fileUpload') fileUpload: FileUpload;
    @Input() isView = false;

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _ProductService: ProductService,
        private _UserService: UserService,
        private _CategoriesService: CategoriesService,
        private _BrandsService: BrandsService,
        private _SuppliersService: SuppliersService,
        private _CountriesServices: CountriesService,
        public dialogService: DialogService,
        private _provincesService: ProvincesService,
    ) {
        super(null, _injector);

        this.formGroup = this.formBuilder.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
            reward: ['', Validators.required],
            code: ['', Validators.required],
            height: ['', Validators.maxLength(10)],
            width: ['', Validators.maxLength(10)],
            length: ['', Validators.maxLength(10)],
            image: [],
            weightGram: ['', Validators.required],
            idCategory: ['', Validators.required],
            idCategory1: [''],
            idCategory2: [''],
            productProvince: [''],
            idBrand: ['', Validators.required],
            idCountry: [''],
            idSupplier: [],
            businessLicense: [],
            description: [],
            policyCtv: [],
            detail: [],
            detailHtml: [],
            isActive: [],
            listImages: [],
            isApproved: [],
            preOrderDate: [],
            isPreOrder: [],
            shipTimeAvg: [],
            rank: [],
            isSoldOut: [],
            tax: [''],
            unit: [''],
            titleSeo: [''],
            descriptionSeo: [''],
            type: [''],
            key: [''],
            quantityProduct: [''],
            priceProduct: [''],
            pointClient: [''],
        });
    }

    async ngOnInit() {
        this.cols = [
            {
                field: 'code',
                header: 'Mã',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                sort: true
            },
            {
                field: 'price',
                header: 'Giá',
                visible: true,
                sort: true
            },
            {
                field: 'priceProduct',
                header: 'Giá Combo',
                visible: true,
                sort: true
            },
            {
                field: 'type',
                header: 'Loại',
                visible: true,
                width: '15%',
                sort: true
            },
            {
                field: 'quantityProduct',
                header: 'Số lượng',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'totalPrice',
                header: 'Tổng',
                visible: true,
                sort: true
            }
        ];

        await this.onLoadBrands();
        await this.onLoadSuppliers(0);
        await this.onLoadCountries();
        await this.loadProvince();
        await this.loadType();
    }

    async loadProvince() {
        this.productProvinces = [];
        await this._provincesService.GetShortProduct(-1, 1).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.province_options.push({ label: item.label, value: item.value });
                    if (!this.modelEdit.id || this.modelEdit.id <= 0) {
                        if (item.isSellDefault && item.isSellDefault === true) {
                            this.productProvinces.push(item.value);
                            this.productProvinceCity.push(item.value);
                        }
                    }
                });
            }
        });
    }

    async onChangeType() {
        switch (this.modelEdit.type) {
            case 2: //combo
                this.modelEdit.price = 0;
                break;
            case 3:
                this.modelEdit.price = 0;
                break;
            default:

        }
    }

    async loadType() {
        this.type_options = [];
        this.type_options.push({ label: "Sản phẩm", value: 1 });
        this.type_options.push({ label: "Combo", value: 2 });
        this.type_options.push({ label: "Quà tặng", value: 3 });
    }

    onAdminApprove(status: number) {
        this._ProductService.Approved(this.modelEdit.id, status).then(rs => {
            if (rs.status) {
                if (status == 2)
                    this._notifierService.showSuccess('Phê duyệt thành công');
                if (status == 3)
                    this._notifierService.showSuccess('Sản phẩm không được duyệt');
                this.isShow = false;
                this.closePopup.emit(rs.data);
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    SaveAndSendApprove() {
        this.modelEdit.statusApprove = 1;
        this.save();
    }

    save() {
        this.isView = true;
        if (this.userId)
            this.modelEdit.userId = this.userId;

        if (this.productProvinces) {
            this.modelEdit.productProvinces = [];
            this.productProvinces.forEach(item => {
                this.modelEdit.productProvinces.push({
                    "id": 0,
                    "idProduct": 0,
                    "idProvince": item,
                    "isActived": true,
                    "createdUserId": this.modelEdit.userId,
                    "createdDate": null,
                    "idProvinceNavigation": null
                });
            });
        }
        if (this.selectedProduct) {
            this.modelEdit.productCombos = [];
            this.selectedProduct.forEach(c => {
                this.modelEdit.productCombos.push({ idProductCombo: c.id, quantity: c.quantityProduct, isActived: 1, price: c.priceProduct });
            });
        }
        this._ProductService.post(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isShow = false;
                this.closePopup.emit(rs.data);
            } else {
                this._notifierService.showError(rs.message);
            }
            this.isView = false;
        }).catch(err => {
            this.isView = false;
            this._notifierService.showHttpUnknowError();
        });
    }

    async onLoadCategories() {
        await this._CategoriesService.GetShort(0, '').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    item.label = item.name;
                    item.value = item.id;
                });
                this.cate_options = rs.data;
            }
        });
    }

    async onLoadCategories1() {
        await this._CategoriesService.GetShort(this.modelEdit.idCategory, '').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    item.label = item.name;
                    item.value = item.id;
                });
                this.cate1_options = rs.data;
            }
        });
    }
    async onLoadCategories2() {
        await this._CategoriesService.GetShort(this.modelEdit.idCategory1, '').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    item.label = item.name;
                    item.value = item.id;
                });
                this.cate2_options = rs.data;
            }
        });
    }
    // async onLoadCategories() {
    //     // await this._CategoriesService.searchTree('').then(rs => {
    //     //     this.categories = <TreeNode[]>rs.data;
    //     // });
    //     await this._CategoriesService.searchDropdown('').then(rs => {
    //         this.dropdownCategories = rs.data;
    //     });
    // }
    async onLoadBrands() {
        this.dropdownBrands = [];
        await this._BrandsService.GetShort('', -1, 0, 10000).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.dropdownBrands.push({ label: item.name, value: item.id });
                });
            }
        });
    }
    async onLoadSuppliers(id) {
        this.dropdownSuppliers = [];
        await this._SuppliersService.GetShort('', id).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.dropdownSuppliers.push({ label: item.name, value: item.id });
                });
            }
        });
    }
    async onLoadCountries() {
        this.dropdowncountries = [];
        await this._CountriesServices.GetShort('').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.dropdowncountries.push({ label: item.name, value: item.id });
                });
            }
        });
    }
    async showPopup(item: any = {}) {
        this.isShow = true;
        this.isView = false;
        this.hideHtml = true;
        this.selectedCategories = [];
        this.dataSource = [];
        this.selectedProduct = [];
        this.togglePopupDelete();
        await this.onLoadCategories();

        if (item) {
            if (item.userId) { this.userId = item.userId; }
            if (item.id) {
                await this._ProductService.getDetailById(item.id).then(async rs => {
                    if (rs.status) {
                        this.modelEdit = rs.data;
                        var lstProvince = rs.data.productProvinces;
                        this.productProvinces = [];
                        if (lstProvince && lstProvince.length > 0) {
                            lstProvince.forEach(item => {
                                if (item.isActived && item.isActived === true) {
                                    this.productProvinces.push(item.idProvince);
                                }
                            });
                        }
                        if (rs.data.productCombos && rs.data.productCombos.length > 0) {
                            await this._ProductService.getProducsInCombo(this.modelEdit.id).then(async rs => {
                                if (rs.status) {
                                    this.selectedProduct = rs.data;
                                }
                            });
                        }

                        await this.onLoadCategories1();
                        await this.onLoadCategories2();
                    }
                }, error => {
                    this._notifierService.showHttpUnknowError();
                });
            } else {
                this.togglePopupDelete();
            }
        } else {
            this.productProvinces = this.productProvinceCity;
            this.togglePopupDelete();
            const crrUser = await this._UserService.getCurrentUser();
            if (crrUser) {
                if (crrUser.idClient) {
                    this.modelEdit.idClient = crrUser.idClient;
                } else {
                    this._notifierService.showError('Tài khoản chưa phải là doanh nghiệp!');
                    return;
                }
            } else {
                this._notifierService.showError('Tài khoản chưa phải là doanh nghiệp!');
                return;
            }
        }

    }

    togglePopupDelete(): any {
        this.modelEdit = {
            idCategory: 0,
            type: 1,
            idCategory1: 0,
            idCategory2: 0,
            isActive: true
        };
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
                this.results = this.modelEdit.id > 0 ? rs.data.filter(d => d.id !== this.modelEdit.id) : rs.data;
                this.total = rs.totalRecord;
            }
        });
    }

    onRemove(index: number): void {
        this.selectedProduct.splice(index, 1);
    }

    onSelect(event) {
        if (this.selectedProduct.findIndex(rs => rs.id === event.id) < 0) {
            event.quantityProduct = 1;
            event.productType = event.type;
            event.priceProduct = event.price;
            this.selectedProduct.push(event);
            this.key = null;
        } else {
            this._notifierService.showError('Sản phẩm này đã được chọn');
        }
    }

    // checkNode(nodes: TreeNode[], str: string[]) {
    //     for (let i = 0; i < nodes.length; i++) {
    //         for (let j = 0; j < nodes[i].children.length; j++) {
    //             if (str.some(x => x === nodes[i].children[j].data)) {
    //                 if (!this.selectedCategories.some(x => x.data === nodes[i].children[j].data)) {
    //                     this.selectedCategories.push(nodes[i].children[j]);
    //                 }
    //             }
    //         }

    //         this.checkNode(nodes[i].children, str);
    //         const count = nodes[i].children.length;
    //         let c = 0;
    //         for (let j = 0; j < nodes[i].children.length; j++) {
    //             if (this.selectedCategories.some(x => x.data === nodes[i].children[j].data)) {
    //                 c++;
    //             }
    //             if (nodes[i].children[j].partialSelected) { nodes[i].partialSelected = true; }
    //         }
    //         if (c === 0) {
    //             if (str.some(x => x === nodes[i].data)) {
    //                 if (!this.selectedCategories.some(x => x.data === nodes[i].data)) {
    //                     this.selectedCategories.push(nodes[i]);
    //                 }
    //             }
    //         } else if (c === count) {
    //             nodes[i].partialSelected = false;
    //             if (!this.selectedCategories.some(x => x.data === nodes[i].data)) {
    //                 this.selectedCategories.push(nodes[i]);
    //             }
    //         } else {
    //             nodes[i].partialSelected = true;
    //         }
    //     }
    // }

    onAdd() {
        const obj = {
            status: 0,
            isEdit: true
        };
        this.dataSource.splice(0, 0, obj);
    }

    ShowHideHtml() {
        this.hideHtml = !this.hideHtml;
    }
}
