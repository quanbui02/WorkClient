import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageEditBase } from '../../lib-shared/classes/base/second-page-edit-base';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Utilities } from '../../shared/utilities';
import { UserService } from '../../lib-shared/services/user.service';
import { OmiCallsService } from '../../lib-shared/services/omicall.service';

@Component({
    selector: 'app-user-omicall',
    templateUrl: './user-omicall.component.html',
    styleUrls: ['./user-omicall.component.scss']
})
export class UserOmicallComponent extends SecondPageEditBase implements OnInit {
    item: any;
    modelEdit: any = {};
    agentInvite: any = {};
    isLoading = false;
    isSaving = false;
    isDeleting = false;
    isView = false;
    userTypeDataSource = [];
    captchaUrl = '';
    captchaInvalid = false;
    role_options: any[];

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _userRoleService: UserService,
        private _omiCallsService: OmiCallsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {

        this.formGroup = this.formBuilder.group({
            omiCallRole: [''],
            email: ['']
        });
        this.role_options = [
            { label: 'Sale', value: 'Sale' },
            { label: 'Trưởng nhóm sale', value: 'Trưởng nhóm sale' },
            { label: 'Trưởng phòng Kinh Doanh', value: 'Trưởng phòng Kinh Doanh' },
            { label: 'Kế toán', value: 'Kế toán' },
            { label: 'Giám đốc', value: 'Giám đốc' }
        ];
    }

    async loadOptions() {
    }

    save() {
        if (!this.modelEdit.email || this.modelEdit.email === '') {
            this._notifierService.showWarning('Vui lòng nhập thư điện tử!');
            return;
        }
        this.agentInvite.role_name = this.modelEdit.omiCallRole;
        this.agentInvite.identify_info = this.modelEdit.email;
        this.agentInvite.full_name = this.modelEdit.name;
        this._omiCallsService.OmicallAgentInvite(this.agentInvite).then(omicallresponse => {
            if (omicallresponse.status) {
                if (omicallresponse.data.status_code == 9999) {
                    this.isSaving = true;
                    if (this.modelEdit.userId > 0) {
                        this.modelEdit.IsOmiCall = true;
                        this.modelEdit.OmiCallSecretKey = omicallresponse.data.payload.pbx_account.password;
                        this.modelEdit.OmiCallSipUser = omicallresponse.data.payload.pbx_account.sip_user;
                        this.modelEdit.OmiCallDomain = omicallresponse.data.payload.pbx_account.domain;
                        this._userRoleService.UpdateOmicall(this.modelEdit)
                            .then(response => {
                                if (response.status) {
                                    this._notifierService.showSuccess('Đồng bộ người dùng thành công!');
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
                    }
                } else {
                    this.isSaving = false;
                    this._notifierService.showWarning('Đồng bộ người dùng thất bại.\nNội dung lỗi: ' + omicallresponse.data.message);
                }

            }
            else {
                this.isSaving = false;
                this._notifierService.showWarning('Đồng bộ người dùng thất bại.\nNội dung lỗi: ' + omicallresponse.error);
            }

        }).catch(error => {
            this.isSaving = false;
            this._notifierService.showWarning(Utilities.getErrorDescription(error));
        });


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
                        if (!this.modelEdit.omiCallRole) {
                            this.modelEdit.omiCallRole = 'Sale';
                        }
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

}
