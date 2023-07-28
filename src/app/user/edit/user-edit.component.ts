import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageEditBase } from '../../lib-shared/classes/base/second-page-edit-base';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Utilities } from '../../shared/utilities';
import { UserService } from '../../lib-shared/services/user.service';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent extends SecondPageEditBase implements OnInit {
    item: any;
    modelEdit: any = {};
    isLoading = false;
    isSaving = false;
    isDeleting = false;
    isView = false;
    userTypeDataSource = [];
    captchaUrl = '';
    captchaInvalid = false;

    constructor(
        protected _injector: Injector,
        private _userRoleService: UserService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = new FormGroup({
            code: new FormControl(''),
        });
    }

    async loadOptions() {
    }

    save() {
        // if (!this.modelEdit.userName || this.modelEdit.userName === '') {
        //     this._notifierService.showWarning('Vui lòng nhập tên tài khoản!');
        //     return;
        // }
        // if (!this.modelEdit.email || this.modelEdit.email === '') {
        //     this._notifierService.showWarning('Vui lòng nhập thư điện tử!');
        //     return;
        // }
        // if (!this.item && (!this.modelEdit.password || this.modelEdit.password === '')) {
        //     this._notifierService.showWarning('Vui lòng nhập mật khẩu!');
        //     return;
        // }
        // if (
        //     (!this.modelEdit.password || this.modelEdit.password !== '') &&
        //     this.modelEdit.passwordRepeat !== this.modelEdit.password
        // ) {
        //     this._notifierService.showWarning('Mật khẩu không khớp!');
        //     return;
        // }
        this.isSaving = true;
        if (this.modelEdit.userId > 0) {
            this._userRoleService.UpdateCode(this.modelEdit)
                .then(response => {
                    if (response.status) {
                        this._notifierService.showSuccess('Cập nhật người dùng thành công!');
                        this.isShow = false;
                        this.closePopup.emit();
                    } else {
                        this.isSaving = false;
                        this._notifierService.showWarning('Cập nhật người dùng thất bại.\nNội dung lỗi: ' + response.error);
                    }
                })
                .catch(error => {
                    this.isSaving = false;
                    this._notifierService.showWarning(Utilities.getErrorDescription(error));
                });

            // this._userRoleService.Update(this.modelEdit)
            //     .then(response => {
            //         if (response.status) {
            //             this._notifierService.showSuccess('Cập nhật người dùng thành công!');
            //             this.isShow = false;
            //             this.closePopup.emit();
            //         } else {
            //             this.isSaving = false;
            //             this._notifierService.showWarning('Cập nhật người dùng thất bại.\nNội dung lỗi: ' + response.error);
            //         }
            //     })
            //     .catch(error => {
            //         this.isSaving = false;
            //         this._notifierService.showWarning(Utilities.getErrorDescription(error));
            //     });
        }
        else {
            this._userRoleService.Create(this.modelEdit)
                .then(response => {
                    if (response.status) {
                        this._notifierService.showSuccess('Tạo người dùng thành công!');
                        this.isShow = false;
                        this.closePopup.emit();
                    } else {
                        this.isSaving = false;
                        this._notifierService.showWarning('Tạo người dùng thất bại.\nNội dung lỗi: ' + response.error);
                    }
                })
                .catch(error => {
                    this.isSaving = false;
                    this._notifierService.showWarning(Utilities.getErrorDescription(error));
                });
        }

    }

    async showPopup(id: any) {
        this.isShow = true;
        this.loadOptions();
        if (id) {
            this.isLoading = true;
            this.item = id;
            this.isView = true;
            this._userRoleService
                .getDetail(this.item)
                .then(response => {
                    this.isLoading = false;

                    if (response.status) {
                        this.modelEdit = response.data;
                        // this.modelEdit.isSuperUserBool = this.modelEdit.isSuperUser();
                    } else {
                        if (response.message === 'ERR_USER_USERNAME_NOT_ALLOWED') {
                            this._notifierService.showWarning('Tên tài khoản không hợp lệ (Tối thiểu 4 ký tự, không chứa ký tự đặc biệt trừ _ và .)');
                        } else {
                            this._notifierService.showWarning('Xảy ra lỗi không xác định.');
                        }
                    }
                })
                .catch(error => {
                    this.isLoading = false;
                    this._notifierService.showWarning(Utilities.getErrorDescription(error));
                });
        } else {
            this.captchaUrl = this._userRoleService.getCaptchaUrl();
            this.togglePopupDelete();
        }
    }

    togglePopupDelete(): any {
        this.modelEdit = {};
    }

    refreshCaptcha() {
        this.captchaUrl = this._userRoleService.getCaptchaUrl();
    }
}
