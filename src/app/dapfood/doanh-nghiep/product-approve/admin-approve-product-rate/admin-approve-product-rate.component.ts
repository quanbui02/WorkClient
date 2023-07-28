import { Component, Injector, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { MessageService, TreeNode } from 'primeng/api';
import { ProductService } from '../../../services/products.service';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { CategoriesService } from '../../../services/categories.service';

@Component({
    selector: 'app-admin-approve-product-rate',
    templateUrl: './admin-approve-product-rate.component.html',
    styleUrls: ['./admin-approve-product-rate.component.scss']
})
export class AdminApproveProductRateComponent extends SecondPageEditBase
    implements OnInit {
    categories: TreeNode[];
    selectedCategories: TreeNode[] = [];
    modelEdit: any = {
        idCategory: 0,
        idCategoryOne: 0,
        idCategory2: 0,
    };
    listImage: any[] = [];
    dropdownCategories: any[];
    cate_options: any[];
    cate1_options: any[];
    cate2_options: any[];

    @ViewChild('fileUpload') fileUpload: FileUpload;
    @Input() isView = false;

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _ProductService: ProductService,
        private _CategoriesService: CategoriesService
    ) {
        super(null, _injector);
        this.formGroup = this.formBuilder.group({
            idCategory: ['', Validators.required],
            idCategoryOne: [''],
            idCategory2: [''],
            rate: [],
            rank: []
        });
    }

    async ngOnInit() {
    }

    // async onLoadCategories() {
    //     // await this._CategoriesService.searchTree('').then(rs => {
    //     //     this.categories = <TreeNode[]>rs.data;
    //     // });
    //     await this._CategoriesService.searchDropdown('', true).then(rs => {
    //         this.dropdownCategories = rs.data;
    //     });
    // }


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

    save() {
        this._ProductService.SaveRate(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
                this.isShow = false;
                this.closePopup.emit();
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    async showPopup(item: any = {}) {
        this.isShow = true;
        await this.onLoadCategories();
        //this.modelEdit = data;

        await this._ProductService.getDetail(item.id).then(async rs => {
            if (rs.status) {
                this.modelEdit = rs.data;

                this.modelEdit.idCategoryOne = this.modelEdit.idCategory1;
                await this.onLoadCategories1();
                await this.onLoadCategories2();
            }
        }, error => {
            this._notifierService.showHttpUnknowError();
        });

    }



}
