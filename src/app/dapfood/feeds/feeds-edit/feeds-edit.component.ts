import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { FeedsService } from '../../services/feeds.service';

@Component({
    selector: 'app-feeds-edit',
    templateUrl: './feeds-edit.component.html',
    styleUrls: ['./feeds-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeedsEditComponent extends SecondPageEditBase
    implements OnInit {
    key: string;
    isLoading = false;
    modelEdit: any = {
    };

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _FeedsService: FeedsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            type: [''],
            content: [''],
            images: [''],
            like: [''],
            comment: [''],
            isActived: [''],
            isDeleted: [''],
            idProduct: [''],
            sort: ['']
        });
    }

    save() {
        this._FeedsService.post(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isShow = false;
                this.closePopup.emit();
                this.modelEdit = {};
            } else {
                this._notifierService.showError(rs.message);
            }
        }).catch(error => {
            this._notifierService.showResponseError(error);
        });
    }

    async showPopup(id: any) {
        this.isShow = true;
        if (id > 0) {
            await this._FeedsService.getDetail(id).then(async response => {
                if (response.status) {
                    this.modelEdit = response.data;
                }
            }, (error) => {
                this._notifierService.showResponseError(error);
            });
        } else {
            this.modelEdit = {};
        }
    }

}


