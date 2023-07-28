import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../lib-shared/classes/base/second-page-edit-base';
import { LogsService } from '../logs.service';

@Component({
    selector: 'app-logs-edit',
    templateUrl: './logs-edit.component.html',
    styleUrls: ['./logs-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LogsEditComponent extends SecondPageEditBase
    implements OnInit {
    key: string;
    isLoading = false;
    modelEdit: any = {
        idCategory: 1,
    };

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _LogsService: LogsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            serviceName: [''],
            source: [''],
            path: [''],
            url: [''],
            message: [''],
            innerException: [''],
            stackTrace: [''],
            data: [''],
            isDeleted: [''],
            createdUserId: [''],
            createdDate: [''],
        });
    }

    save() {
        this._LogsService.post(this.modelEdit).then(rs => {
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
            await this._LogsService.getDetail(id)
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


