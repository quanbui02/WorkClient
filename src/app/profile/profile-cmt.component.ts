import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Utilities } from '../shared/utilities';
import { SecondPageEditBase } from '../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../lib-shared/services/user.service';
import { BanksService } from '../dapfood/services/banks.service';
import { SelectItem } from 'primeng/api';
import { LogSmsService } from '../dapfood/services/logsms.service';

@Component({
    selector: 'app-profile-cmt',
    templateUrl: './profile-cmt.component.html',
    styleUrls: ['./profile-cmt.component.scss']
})
export class ProfileCmtComponent extends SecondPageEditBase implements OnInit {
    readonly USER_INFO_KEY = 'user_info';
    item: any;
    modelEdit: any = {};
    isLoading = false;
    isSaving = false;
    isDeleting = false;
    isView = false;
    userTypeDataSource = [];
    captchaUrl = '';
    captchaInvalid = false;
    code: string;

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _userRoleService: UserService,
        private _LogSmsService: LogSmsService,

    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = new FormGroup({
            code: new FormControl(''),
            cmt: new FormControl('', Validators.compose([Validators.required])),
            cmtBackside: new FormControl('', Validators.compose([Validators.required])),
            cmtFront: new FormControl('', Validators.compose([Validators.required]))
        });
    }

    save() {
        this.isSaving = true;
        if (this.modelEdit.userId > 0) {
            this._userRoleService.UpdateCmt(this.modelEdit)
                .then(response => {
                    if (response.status) {
                        this._notifierService.showSuccess('Cập nhật CMND thành công!');
                        this.isShow = false;
                        this.closePopup.emit();
                    } else {
                        this.isSaving = false;
                        this._notifierService.showWarning('Cập nhật thông tin CMND thất bại.\nNội dung lỗi: ' + response.message);
                    }
                })
                .catch(error => {
                    this.isSaving = false;
                    this._notifierService.showWarning('Có lỗi xảy ra: ' + Utilities.getErrorDescription(error));
                });
        }
    }

    async showPopup(id: any) {
        this.isShow = true;
        if (id) {
            this.isLoading = true;
            this.item = id;
            this.isView = true;
            this._userRoleService
                .getCurrent()
                .then(response => {
                    this.isLoading = false;
                    if (response.status) {
                        this.modelEdit = response.data;
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
                    this._notifierService.showWarning('Có lỗi xảy ra: ' + Utilities.getErrorDescription(error));
                });
        } else {
            this.captchaUrl = this._userRoleService.getCaptchaUrl();
            this.togglePopupDelete();
        }
    }

    togglePopupDelete(): any {
        this.modelEdit = {};
    }

    GetOTP() {
        this._LogSmsService.GetOtp(4).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }
}
