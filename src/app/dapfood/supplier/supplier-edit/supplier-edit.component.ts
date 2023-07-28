import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { SuppliersService } from '../../services/suppliers.service';
import { ThemesService } from '../../services/themes.service';

@Component({
    selector: 'app-supplier-edit',
    templateUrl: './supplier-edit.component.html',
    styleUrls: ['./supplier-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SupplierEditComponent extends SecondPageEditBase
    implements OnInit {
    key: string;
    isLoading = false;
    modelEdit: any = {
        idCategory: 1,
    };
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _SuppliersService: SuppliersService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            code: [''],
            name: [''],
            isActive: ['']
        });
    }

    save() {
        this._SuppliersService.post(this.modelEdit).then(rs => {
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
            await this._SuppliersService.getDetail(id)
                .then(async response => {
                    if (response.status) {
                        this.modelEdit = response.data;
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        } else {
            this.modelEdit = {
                isActive: true
            };
        }
    }
}




