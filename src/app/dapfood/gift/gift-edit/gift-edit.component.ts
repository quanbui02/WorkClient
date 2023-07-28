import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { FaqsService } from '../../services/faqs.service';
import { GiftsService } from '../../services/vouchers.service';

@Component({
    selector: 'app-gift-edit',
    templateUrl: './gift-edit.component.html',
    styleUrls: ['./gift-edit.component.scss']
})
export class GiftEditComponent extends SecondPageEditBase
    implements OnInit {

    selectedItems = [];
    isLoading = false;
    type_options = [];

    modelEdit: any = {
        type: 1,
    };

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _GiftsService: GiftsService,
        private messageService: MessageService
    ) {
        super(null, _injector);
    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            type: [''],
            image: [''],
            name: [''],
            value: ['']
        });
    }

    async loadCate() {
        this.type_options.push({ label: 'Vận chuyển', value: 1 });
        this.type_options.push({ label: 'Vouchers', value: 2 });
    }

    save() {
        this._GiftsService.post(this.modelEdit).then(rs => {
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
            await this._GiftsService.getDetail(id)
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


