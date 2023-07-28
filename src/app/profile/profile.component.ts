import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Utilities } from '../shared/utilities';
import { SecondPageEditBase } from '../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../lib-shared/services/user.service';
import { BanksService } from '../dapfood/services/banks.service';
import { SelectItem } from 'primeng/api';
import { LogSmsService } from '../dapfood/services/logsms.service';
import { ProfileCmtComponent } from './profile-cmt.component';
import { ProvincesService } from '../dapfood/services/provinces.service';
import { DistrictsService } from '../dapfood/services/districts.service';
import { WardsService } from '../dapfood/services/wards.service';
import { ProfileAddressComponent } from './profile-address.component';
import { UserAddressService } from '../dapfood/services/useraddress.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends SecondPageEditBase implements OnInit {
    readonly USER_INFO_KEY = 'user_info';
    total = 0;
    page = 1;
    limit = 100;
    limitAll = 10000;
    item: any;
    modelEdit: any = {};
    modelAddress: any = {};
    isLoading = false;
    isSaving = false;
    isDeleting = false;
    isView = false;
    userTypeDataSource = [];
    captchaUrl = '';
    captchaInvalid = false;
    banks: SelectItem[];
    code: string;
    listAddress = [];
    cols = [];
    idTab = 0;

    province_options: any[];
    distric_options: any[];
    ward_options: any[];

    @ViewChild('cmt') cmt: ProfileCmtComponent;
    @ViewChild('address') address: ProfileAddressComponent;
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _userRoleService: UserService,
        private _BanksService: BanksService,
        private _LogSmsService: LogSmsService,
        private _UserAddressService: UserAddressService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = new FormGroup({
            captcha: new FormControl(''),
            avatar: new FormControl(''),
            bankNumber: new FormControl(''),
            bankCardNumber: new FormControl(''),
            bankFullName: new FormControl(''),
            bankBranch: new FormControl(''),
            idBank: new FormControl(''),
            clientName: new FormControl(''),
            code: new FormControl(''),
            name: new FormControl('', Validators.compose([Validators.required])),
            userName: new FormControl({ value: '', disabled: this.isView }, Validators.compose([Validators.required])),
            phone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^((84|0[3|5|7|8|9])+([0-9]{8})\b)$/)])),
            email: new FormControl('', Validators.compose([null, Validators.pattern(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)]))
        });
        this.cols = [
            {
                field: 'address',
                header: 'Địa chỉ',
                visible: true,
                width: '50%',
                sort: true,
            },
            {
                field: 'idWard',
                header: 'Phường/Xã',
                visible: true,
                width: '20%',
                sort: true
            },

            {
                field: 'idDistrict',
                header: 'Quận/Huyện',
                visible: true,
                width: '20%',
                sort: true
            },

            {
                field: 'idProvince',
                header: 'Tỉnh/Thành phố',
                visible: true,
                width: '20%',
                sort: true
            }, {
                field: 'isPrimary',
                header: 'Địa chỉ chính',
                align: 'center',
                visible: true,
                width: '10%',
                sort: true
            },
        ];
    }

    async loadBanks() {
        this.banks = [];
        this.banks.push({ label: '-- Chọn ngân hàng --', value: -1 });
        this._BanksService.GetShort('').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.banks.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    save() {
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
        // if (this.modelEdit.idClient > 0) {
        //     // Update doanh nghiệp
        //     this._userRoleService.UpdateGeneral(this.modelEdit)
        //         .then(response => {
        //             if (response.status) {
        //                 localStorage.removeItem(this._userRoleService.USER_INFO_KEY);
        //                 window.location.reload();
        //                 this._notifierService.showSuccess('Cập nhật người dùng thành công!');
        //                 this.isShow = false;
        //                 this.closePopup.emit();
        //             } else {
        //                 this.isSaving = false;
        //                 this._notifierService.showWarning('Cập nhật người dùng thất bại.\nNội dung lỗi: ' + response.message);
        //             }
        //         })
        //         .catch(error => {
        //             this.isSaving = false;
        //             this._notifierService.showWarning('Có lỗi xảy ra: ' + Utilities.getErrorDescription(error));
        //         });
        // } else {
        // Update CTV
        this._userRoleService.Update(this.modelEdit).then(response => {
            if (response.status) {
                localStorage.removeItem(this._userRoleService.USER_INFO_KEY);
                localStorage.removeItem("access_token");
                localStorage.removeItem("id_token");
                window.location.reload();
                this._notifierService.showSuccess('Cập nhật người dùng thành công!');
                this.isShow = false;
                this.closePopup.emit();
            } else {
                this.isSaving = false;
                this._notifierService.showWarning('Cập nhật người dùng thất bại.\nNội dung lỗi: ' + response.message);
            }
        })
            .catch(error => {
                this.isSaving = false;
                this._notifierService.showWarning('Có lỗi xảy ra: ' + Utilities.getErrorDescription(error));
            });
        // }
    }
    saveBank() {
        this.isSaving = true;
        if (this.modelEdit.userId > 0) {
            this._userRoleService.UpdateBank(this.modelEdit, this.code)
                .then(response => {
                    if (response.status) {
                        localStorage.removeItem(this._userRoleService.USER_INFO_KEY);
                        window.location.reload();
                        this._notifierService.showSuccess('Cập nhật người dùng thành công!');
                        this.isShow = false;
                        this.closePopup.emit();
                    } else {
                        this.isSaving = false;
                        this._notifierService.showWarning('Cập nhật người dùng thất bại.\nNội dung lỗi: ' + response.message);
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
        this.loadBanks();
        if (id) {
            this.isLoading = true;
            this.item = id;
            this.isView = true;
            this.formGroup.controls['userName'].disable();
            this.formGroup.controls['phone'].disable();
            this.formGroup.controls['email'].disable();
            this._userRoleService
                .getCurrent()
                .then(response => {
                    this.isLoading = false;

                    if (response.status) {
                        this.modelEdit = response.data;
                        // this.onLoadAddress();

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
                    this._notifierService.showWarning('Có lỗi xảy ra: ' + Utilities.getErrorDescription(error));
                });
        } else {
            this.captchaUrl = this._userRoleService.getCaptchaUrl();
            this.togglePopupDelete();
        }
    }

    onLoadAddress() {
        this._UserAddressService
            .GetsByUserId(this.modelEdit.userId)
            .then(rs => {
                this.isLoading = false;
                if (rs.status) {
                    this.listAddress = rs.data;
                }
            })
            .catch(error => {
                this.isLoading = false;
                this._notifierService.showWarning('Có lỗi xảy ra: ' + Utilities.getErrorDescription(error));
            });
    }
    togglePopupDelete(): any {
        this.modelEdit = {};
    }

    refreshCaptcha() {
        this.captchaUrl = this._userRoleService.getCaptchaUrl();
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

    onCmt(event) {
        event.preventDefault();
        this.cmt.showPopup(this.item);
    }
    onRemoveAddress(id: number): void {
        this._notifierService.showConfirm('Bạn có chắc muốn xóa bản ghi này?', 'Xóa bản ghi?').then(rs => {
            this._UserAddressService.delete(id).then(re => {
                if (re.status) {
                    this._notifierService.showDeleteDataSuccess();
                    this.listAddress = this.listAddress.filter(obj => obj.id !== id);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }
    handleChange(e) {
        this.idTab = e.index;
    }


    onAddress(id) {
        let item: any = {};
        item.id = id;
        item.userId = this.item;
        this.address.showPopup(item);
    }
}
