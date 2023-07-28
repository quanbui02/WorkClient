import { UserService } from './../../../lib-shared/services/user.service';
import { OrdersMessageService } from './../../services/ordersMessage.service';
import { OrderDetailsService } from './../../services/orderdetails.service';
import { FeedbacksService } from './../../services/feedback.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
    selector: 'app-ordersMessage-edit',
    templateUrl: './ordersMessage-edit.component.html',
    styleUrls: ['./ordersMessage-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrdersMessageEditComponent extends SecondPageEditBase
    implements OnInit {
    @Input() status_options: any[];
    isLoading = false;
    modelEdit: any = {};
    userCurr: any;
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _OrdersMessageService: OrdersMessageService,
        private _userService: UserService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            messageStatus: [''],
            idStatus: ['']
        });
        this.userCurr = await this._userService.getCurrentUser();
    }

    save() {
        this._OrdersMessageService.UpdateStatus({
            id: this.modelEdit.id,
            idStatus: this.modelEdit.idStatus,
            messageStatus: this.modelEdit.messageStatus,
            userUpdate: this.userCurr.userId,
            fullNameUpdate: this.userCurr.name
        }).then(rs => {
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
            await this._OrdersMessageService.GetById(id)
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





