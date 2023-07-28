import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { CategoriesService } from '../../services/categories.service';

@Component({
    selector: 'app-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent extends SecondPageEditBase
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
    modelEdit: any = {};
    // selectedProduct = [];
    selectedProduct: any;
    selectedPromotion: any;
    type_options = [];
    dropdownCategories: any[];

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _CategoriesService: CategoriesService,
        private messageService: MessageService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            name: [''],
            idParent: [''],
            image: [''],
            avatar: [''],
            isActive: [''],
            isPrivate: [''],
            key: [''],
            description: [''],
            sort: [''],
        });
    }

    async onLoadCategories() {
        // await this._CategoriesService.searchTree('').then(rs => {
        //     this.categories = <TreeNode[]>rs.data;
        // });
        await this._CategoriesService.searchDropdown('').then(rs => {
            this.dropdownCategories = rs.data;
        });
    }

    save() {
        this._CategoriesService.post(this.modelEdit).then(rs => {
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
        await this.onLoadCategories();

        if (id > 0) {
            await this._CategoriesService.getDetail(id)
                .then(async response => {
                    if (response.status) {
                        this.modelEdit = response.data;
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        } else {
            this.modelEdit = {};
        }
    }

}


