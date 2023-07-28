import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { FoodsService } from '../../services/foods.service';
import { ProductService } from '../../services/products.service';
import { FoodCategoriesService } from '../../services/foodcategories.service';

@Component({
    selector: 'app-foods-edit',
    templateUrl: './foods-edit.component.html',
    styleUrls: ['./foods-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FoodsEditComponent extends SecondPageEditBase
    implements OnInit {

    total = 0;
    page = 1;
    limit = 100;
    limitAll = 10000;
    selectedItems = [];
    selectedTreeNode = [];
    isLoading = false;
    cate_options = [];
    results: any;
    key: string;
    modelEdit: any = {
        idCategory: 1,
    };
    dataCategory = [];
    dataTree = [];
    selectedProduct = [];
    cols = [];
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _foodsService: FoodsService,
        private _productService: ProductService,
        private _foodCategoriesService: FoodCategoriesService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            name: new FormControl('', Validators.compose([Validators.required])),
            image: [''],
            idcategory: [''],
            showFromDate: [''],
            detail: [''],
            showToDate: [''],
            description: [''],
            sort: [''],
            key: [''],
            banner: [''],
            foodCategories: ['']
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

        await this.loadCategory();
    }

    async loadCategory() {
        await this._foodCategoriesService.GetShort(-1, '', -1).then(rs => {
            if (rs.status) {
                this.dataCategory = rs.data;
                this.renderTree();
            }
        });
    }

    async renderTree() {
        this.dataTree = [];
        this.selectedTreeNode = [];
        this.dataCategory.filter(s => s.idParent == 0).forEach(s => {
            let obj = {
                label: s.name,
                value: s.id,
                idParent: s.idParent,
                children: [],
                expanded: false,
            };

            this.dataCategory.filter(x => x.idParent == s.id).forEach(s1 => {
                let obj1 = {
                    label: s1.name,
                    value: s1.id,
                    idParent: s1.idParent,
                    children: [],
                };

                this.dataCategory.filter(x => x.idParent == s1.id).forEach(s2 => {
                    let obj2 = {
                        label: s2.name,
                        value: s2.id,
                        idParent: s2.idParent,
                        children: [],
                    };
                    obj1.children.push(obj2);
                    if (this.modelEdit && this.modelEdit.foodJoinCategories) {
                        if (this.modelEdit.foodJoinCategories.filter(d => d.idCategory == s2.id).length > 0) {
                            this.selectedTreeNode.push(obj2);
                        }
                    }
                });

                obj.children.push(obj1);
                if (this.modelEdit && this.modelEdit.foodJoinCategories) {
                    if (this.modelEdit.foodJoinCategories.filter(d => d.idCategory == s1.id).length > 0) {
                        this.selectedTreeNode.push(obj1);
                    }
                }
            });

            if (this.modelEdit && this.modelEdit.foodJoinCategories) {
                if (this.modelEdit.foodJoinCategories.filter(d => d.idCategory == s.id).length > 0) {
                    //this.selectedTreeNode.push(obj);
                    obj.expanded = true;
                }
            }
            this.dataTree.push(obj);
        })
    }

    async nodeSelect(event) {
        var seletedNote = event.note;
        var lstSelected = this.selectedTreeNode;
    }

    save() {
        this.modelEdit.foodProducts = [];
        this.selectedProduct.forEach(c => {
            this.modelEdit.foodProducts.push({ idProduct: c.id });
        });
        this.modelEdit.foodJoinCategories = [];
        this.selectedTreeNode.forEach(c => {
            this.modelEdit.foodJoinCategories.push({ idCategory: c.value });
            if (c.idParent && c.idParent > 0) {
                this.modelEdit.foodJoinCategories.push({ idCategory: c.idParent });
            }
        });
        this._foodsService.post(this.modelEdit).then(rs => {
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
        await this._productService.Autocomplete(
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

    async showPopup(id: any) {
        this.isShow = true;
        this.selectedProduct = [];
        if (id > 0) {
            await this._foodsService.getDetailById(id)
                .then(async response => {
                    if (response.status) {
                        this.modelEdit = response.data;
                        this.selectedProduct = response.dataTotal;
                        if (this.modelEdit.showFromDate) {
                            this.modelEdit.showFromDate = this.addHours(-7, new Date(this.modelEdit.showFromDate));
                        }
                        if (this.modelEdit.showToDate) {
                            this.modelEdit.showToDate = this.addHours(-7, new Date(this.modelEdit.showToDate));
                        }
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        } else {
            this.modelEdit = {};
        }
        this.renderTree();
        var a = this.selectedTreeNode;
    }

    addHours(numOfHours, date = new Date()) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

        return date;
    }

    async autoComplete(event) {
        const query = event.query;
        let ids = '';
        if (this.selectedProduct != null) {
            ids = this.selectedProduct.map((obj) => obj.id).toString();
        }
        await this._productService.Autocomplete(
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
            this.key = null;
        } else {
            this._notifierService.showError('Sản phẩm này đã được chọn');
        }
    }

    onRemove(index: number): void {
        this.selectedProduct.splice(index, 1);
    }

}


