import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { LevelsService } from '../../services/levels.service';

@Component({
    selector: 'app-level-edit',
    templateUrl: './level-edit.component.html',
    styleUrls: ['./level-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LevelEditComponent extends SecondPageEditBase
    implements OnInit {
    key: string;
    isLoading = false;
    modelEdit: any = {
        idCategory: 1,
    };
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _LevelsService: LevelsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            description: ['']
        });
    }

    save() {
        this._LevelsService.post(this.modelEdit).then(rs => {
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
            await this._LevelsService.getDetail(id)
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




