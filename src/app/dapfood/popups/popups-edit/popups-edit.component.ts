import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { PopupsService } from '../../services/popups.service';

@Component({
    selector: 'app-popups-edit',
    templateUrl: './popups-edit.component.html',
    styleUrls: ['./popups-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PopupsEditComponent extends SecondPageEditBase
    implements OnInit {
    key: string;
    isLoading = false;
    type_options: any[];
    modelEdit: any = {
        idCategory: 1,
    };
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _PopupsService: PopupsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            type: [''],
            name: [''],
            image: [''],
            objectId: [''],
            sort: [''],
            isActive: [''],
            startDate: [''],
            endDate: [''],
        });
        await this.loadOptions();
    }

    async loadOptions() {
        this.type_options = [{ label: '-- Loại --', value: '' }];
        this.type_options.push({ label: 'Đơn hàng', value: 'Order' });
        this.type_options.push({ label: 'Sản phẩm', value: 'Product' });
        this.type_options.push({ label: 'Chương trình thưởng', value: 'Promotion' });
        this.type_options.push({ label: 'Link', value: 'link' });
    }

    save() {
        this._PopupsService.post(this.modelEdit).then(rs => {
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
            await this._PopupsService.getDetail(id)
                .then(async response => {
                    if (response.status) {
                        this.modelEdit = response.data;
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
            this.modelEdit = {};
        }
    }
}


