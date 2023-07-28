import { Component, Injector, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { DialogService, DynamicDialogRef, TreeNode } from 'primeng/api';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { CategoriesService } from '../../../services/categories.service';
import { ProductService } from '../../../services/products.service';
import { UserService } from '../../../../lib-shared/services/user.service';
import { BrandsService } from '../../../services/brands.service';
import { SuppliersService } from '../../../services/suppliers.service';
import { CountriesService } from '../../../services/countries.service';

@Component({
    selector: 'app-admin-product-edit',
    templateUrl: './admin-product-edit.component.html',
    styleUrls: ['./admin-product-edit.component.scss']
})
export class AdminProductEditComponent extends SecondPageEditBase
    implements OnInit {
    categories: TreeNode[];
    ref: DynamicDialogRef;
    selectedCategories: TreeNode[] = [];
    cate_options: any[];
    cate1_options: any[];
    cate2_options: any[];
    dropdownBrands: any[];
    dropdownSuppliers: any[];
    dropdowncountries: any[];
    modelEdit: any = {
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
    };
    listImage: any[] = [];
    dataSource = [];
    userId = 0;
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
        public dialogService: DialogService
    ) {
        super(null, _injector);

        this.formGroup = this.formBuilder.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
            level0: ['', Validators.required],
            level1: ['', Validators.required],
            level2: ['', Validators.required],
            level3: ['', Validators.required],
            level4: ['', Validators.required],
            level5: ['', Validators.required],
            // value1: ['', Validators.required],
            // value2: ['', Validators.required],
            // value3: ['', Validators.required],
            // value4: ['', Validators.required],
            // value5: ['', Validators.required],
            code: ['', Validators.required],
            video1: [],
            videoTitle1: [],
            video2: [],
            videoTitle2: [],
            image: [],
            weightGram: ['', Validators.required],
            idCategory: ['', Validators.required],
            idCategory1: [''],
            idCategory2: [''],
            idBrand: ['', Validators.required],
            idCountry: [''],
            idSupplier: [],
            businessLicense: [],
            description: [],
            policyCtv: [],
            detail: [],
            isActive: [],
            listImages: [],
            isApproved: [],
            preOrderDate: [],
            shipTimeAvg: [],
            isSoldOut: []
        });
    }

    async ngOnInit() {
        await this.onLoadBrands();
        await this.onLoadCountries();
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
        let isAdd = true;
        if (this.modelEdit.id > 0) {
            isAdd = false;
        }
        if (this.userId) { this.modelEdit.userId = this.userId; }

        // if (this.modelEdit.value5 < this.modelEdit.value4 || this.modelEdit.value4 < this.modelEdit.value3 || this.modelEdit.value3 < this.modelEdit.value2 || this.modelEdit.value2 < this.modelEdit.value1) {
        //     this._notifierService.showError('Bạn phải nhập mức thưởng sau lớn hơn mức thưởng trước!');
        //     this.isView = false;
        //     return;
        // }
        if (this.modelEdit.level5 < this.modelEdit.level4 || this.modelEdit.level4 < this.modelEdit.level3 || this.modelEdit.level3 < this.modelEdit.level2 || this.modelEdit.level2 < this.modelEdit.level1 || this.modelEdit.level1 < this.modelEdit.level0) {
            this._notifierService.showError('Bạn phải nhập mức thưởng sau lớn hơn hoặc bằng mức thưởng trước!');
            this.isView = false;
            return;
        }
        if (!isAdd) {
            this._notifierService.showConfirm('Khi cập nhật sản phẩm này quản trị viên sẽ phải kiểm duyệt lại. Bạn có chắc chắn muốn cập nhật sản phẩm không?', 'Thông báo').then(rs => {
                this._ProductService.post(this.modelEdit).then(rs => {
                    if (rs.status) {
                        this._notifierService.showSuccess('Cập nhật thành công');
                        this.isShow = false;
                        this.closePopup.emit(rs.data);
                    } else {
                        this._notifierService.showError(rs.message);
                    }
                    this.isView = false;
                });
            }).catch(err => {
                this.isView = false;
                this._notifierService.showDeleteDataError();
            });
        } else {
            this._ProductService.post(this.modelEdit).then(rs => {
                if (rs.status) {
                    this._notifierService.showSuccess('Cập nhật thành công');
                    this.isShow = false;
                    this.closePopup.emit(rs.data);
                } else {
                    this._notifierService.showError(rs.message);
                }
                this.isView = false;
            });
        }

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
        await this._SuppliersService.GetShort('', id).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    item.label = item.name;
                    item.value = item.id;
                });
                this.dropdownSuppliers = rs.data;
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
        this.selectedCategories = [];
        this.dataSource = [];
        this.togglePopupDelete();
        await this.onLoadCategories();

        if (item) {
            if (item.userId) { this.userId = item.userId; }
            if (item.id) {
                await this._ProductService.getDetail(item.id).then(async rs => {
                    if (rs.status) {
                        this.modelEdit = rs.data;

                        await this.onLoadCategories1();
                        await this.onLoadCategories2();
                        await this.onLoadSuppliers(this.modelEdit.idSupplier);
                    }
                }, error => {
                    this._notifierService.showHttpUnknowError();
                });
            } else {
                this.togglePopupDelete();
            }
        } else {
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
            idCategory1: 0,
            idCategory2: 0,
            isActive: true
        };
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
}

