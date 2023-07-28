import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { BannersService } from '../../services/banners.service';
import { BannercategoriesService } from '../../services/bannercategories.service';
import { FaqsService } from '../../services/faqs.service';
import { CountriesService } from '../../services/countries.service';
import { BrandsService } from '../../services/brands.service';

@Component({
    selector: 'app-brand-edit',
    templateUrl: './brand-edit.component.html',
    styleUrls: ['./brand-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BrandEditComponent extends SecondPageEditBase
    implements OnInit {

    selectedItems = [];
    isLoading = false;
    country_options = [];

    modelEdit: any = {
        idCategory: 1,
    };

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _CountriesService: CountriesService,
        private _BrandsService: BrandsService,
        private messageService: MessageService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            code: ['', Validators.compose([Validators.required])],
            name: ['', Validators.compose([Validators.required])],
            image: [''],
            imageBanner: [''],
            description: [''],
            type: [''],
            idCountry: [''],
            listImages: [''],
            imageAbouts: [''],
            video: [''],
            sort: ['']
        });
        await this.loadCate();
    }

    async loadCate() {
        this.country_options = [{ label: '-- Quốc gia --' }];
        await this._CountriesService.Gets('', 0, 1000).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.country_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    save() {
        this._BrandsService.post(this.modelEdit).then(rs => {
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
        if (id > 0) {
            await this._BrandsService.getDetail(id)
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


