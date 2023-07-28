import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { BannersService } from '../../services/banners.service';
import { BannercategoriesService } from '../../services/bannercategories.service';
import { FaqsService } from '../../services/faqs.service';

@Component({
    selector: 'app-faq-edit',
    templateUrl: './faq-edit.component.html',
    styleUrls: ['./faq-edit.component.scss']
})
export class FaqEditComponent extends SecondPageEditBase
    implements OnInit {

    selectedItems = [];
    isLoading = false;
    type_options = [];

    modelEdit: any = {
        idCategory: 1,
    };

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _FaqsService: FaqsService,
        private messageService: MessageService
    ) {
        super(null, _injector);
    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            name: [''],
            image: [''],
            description: [''],
            detail: [''],
            type: [''],
            sort: [''],
            urlVideo: ['']
        });
    }

    async loadCate() {
        this.type_options.push({ label: 'Hướng dẫn bán hàng', value: 1 });
        this.type_options.push({ label: 'Hướng dẫn sử dụng', value: 2 });
    }

    save() {
        this._FaqsService.post(this.modelEdit).then(rs => {
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
        await this.loadCate();

        if (id > 0) {
            await this._FaqsService.getDetail(id)
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


