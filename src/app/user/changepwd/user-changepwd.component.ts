import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageEditBase } from '../../lib-shared/classes/base/second-page-edit-base';
import { FormBuilder, Validators } from '@angular/forms';
import { Utilities } from '../../shared/utilities';
import { UserService } from '../../lib-shared/services/user.service';

@Component({
    selector: 'app-user-changepwd',
    templateUrl: './user-changepwd.component.html',
    styleUrls: ['./user-changepwd.component.scss']
})
export class UserChangePwdComponent extends SecondPageEditBase implements OnInit {
    modelEdit: any = {};
    item: any;
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _userRoleService: UserService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            password: ['', Validators.required],
            passwordRepeat: ['', Validators.required],
        });
    }

    async loadOptions() {
    }

    save() {
        if (!this.modelEdit.password || this.modelEdit.password === '') {
            this._notifierService.showWarning('Vui lòng nhập mật khẩu!');
            return;
        }
        if (this.modelEdit.passwordRepeat !== this.modelEdit.password) {
            this._notifierService.showWarning('Mật khẩu không khớp!');
            return;
        }
        var obj = {
            'userName': this.item.username,
            'passNew': this.modelEdit.password,
            'passNew2': this.modelEdit.passwordRepeat,
        }
        this._userRoleService.changePassword(obj).then(response => {
            if (response.status) {
                this._notifierService.showSuccess('Đổi mật khẩu người dùng thành công!');
                // this.reset();
                this.isShow = false;
                this.closePopup.emit();
            } else {
                this._notifierService.showWarning('Đổi mật khẩu người dùng thất bại.\nNội dung lỗi: ' + response.message
                );
            }
        })
            .catch(error => {
                this._notifierService.showWarning(Utilities.getErrorDescription(error));
            });
    }
    reset() {
        this.item = null;
        this.modelEdit = null;
    }
    async showPopup(item: any) {
        this.isShow = true;
        this.loadOptions();
        if (item) {
            this.item = item;
            this._userRoleService
                .getDetail(this.item.userId)
                .then(response => {

                    if (response.status) {
                        this.modelEdit = response.data;

                        if (this.modelEdit.type != null && this.modelEdit.type != + '') {
                            this._notifierService.showWarning('Bạn không thể thay đổi mật khẩu cho tài khoản này!');
                            this.cancel();
                        }
                    } else {
                        this._notifierService.showWarning('Xảy ra lỗi không xác định.\nNội dung lỗi: ' + response.message);
                    }
                })
                .catch(error => {
                    this._notifierService.showWarning(Utilities.getErrorDescription(error));
                });
        }
    }
}
