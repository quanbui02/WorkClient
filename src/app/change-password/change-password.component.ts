import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { stringify } from 'querystring';
import { SecondPageEditBase } from '../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../lib-shared/services/user.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends SecondPageEditBase implements OnInit {
    msgs: Message[] = [];
    invalid = false;
    passwordIncorrect = 'PASSWORD_INCORRECT';
    errors = '';
    constructor(
        private _userService: UserService,
        protected _injector: Injector
    ) {
        super(null, _injector);
    }

    ngOnInit() {
        this.msgs = [];
        this.formGroup = new FormGroup({
            oldPassword: new FormControl('', Validators.compose([Validators.required])),
            passwordHash: new FormControl('', Validators.compose([Validators.required])),
            confirmPassword: new FormControl('', Validators.compose([Validators.required]))
        });
    }

    async onShowPopup(data: any) {
        this.msgs = [];
        this.invalid = this.formGroup.invalid;
        this.onReset();
        this.onBeforeShowPopUp();

        if (data > 0) {
            this.itemDetail.id = data;
            this.onAfterShowPopUp();
        }
    }

    // onShowPopup(data: any) {

    //     this.onReset();

    //     this.onBeforeShowPopUp();

    //     if (data) {
    //         this.itemDetail.id = data;
    //     }
    // }

    onReset() {
        this.invalid = false;
        this.itemDetail = {};
        this.formGroup.reset();
    }

    save() {
        this.msgs = [];

        if (!this.itemDetail.oldPassword) {
            this.formGroup.controls['oldPassword'].setErrors({ 'incorrect': true });
            this.formGroup.setErrors({ 'invalid': true });
            this.invalid = true;
            this.msgs.push({ severity: 'error', summary: 'Lỗi: ', detail: 'Nhập mật khẩu hiện tại' });
            return;
        }

        if (!this.itemDetail.passwordHash || this.itemDetail.passwordHash.length < 6) {
            this.formGroup.controls['passwordHash'].setErrors({ 'incorrect': true });
            this.formGroup.setErrors({ 'invalid': true });
            this.invalid = true;
            this.msgs.push({ severity: 'error', summary: 'Lỗi: ', detail: 'Nhập mật khẩu mới' });
            return;
        }

        if (this.itemDetail.oldPassword == this.itemDetail.passwordHash) {
            this.formGroup.controls['oldPassword'].setErrors({ 'incorrect': true });
            this.formGroup.setErrors({ 'invalid': true });
            this.invalid = true;
            this.msgs.push({ severity: 'error', summary: 'Lỗi: ', detail: 'Mật khẩu mới phải khác mật khẩu cũ' });
            return;
        }

        if (this.itemDetail.passwordHash !== this.itemDetail.confirmPassword) {
            this.formGroup.controls['passwordHash'].setErrors({ 'nomatch': true });
            this.formGroup.setErrors({ 'invalid': true });
            this.invalid = true;
            this.msgs.push({ severity: 'error', summary: 'Lỗi: ', detail: 'Mật khẩu không khớp!' });
            return;
        }

        this._userService.changePassword(this.itemDetail)
            .then(response => {
                this.closePopupMethod(true);
                this._notifierService.showSuccess('Đổi mật khẩu thành công');
                this.onAfterSave();
                this.submitting = false;
            }, error => {
                this.invalid = true;
                this.formGroup.controls['oldPassword'].setErrors({ 'incorrect': true });
                this.formGroup.setErrors({ 'invalid': true });
                //this.showValidateMessage();
                this.msgs.push({ severity: 'error', summary: 'Lỗi: ', detail: error.error.message });
                this.submitting = false;
            });
    }

    showValidateMessage() {
        this.validationSummary.showValidationSummary();
        this.submitting = false;
    }
}
