import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Utilities } from '../shared/utilities';
import { SecondPageEditBase } from '../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../lib-shared/services/user.service';
import { SelectItem } from 'primeng/api';
import { ProvincesService } from '../dapfood/services/provinces.service';
import { DistrictsService } from '../dapfood/services/districts.service';
import { WardsService } from '../dapfood/services/wards.service';
import { UserAddressService } from '../dapfood/services/useraddress.service';
import { async } from '@angular/core/testing';

@Component({
    selector: 'app-profile-address',
    templateUrl: './profile-address.component.html',
    styleUrls: ['./profile-address.component.scss']
})
export class ProfileAddressComponent extends SecondPageEditBase implements OnInit {
    readonly USER_INFO_KEY = 'user_info';
    item: any;
    modelEdit: any = {};
    isLoading = false;
    isSaving = false;
    isView = false;

    province_options: any[];
    distric_options: any[];
    ward_options: any[];

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _UserAddressService: UserAddressService,
        private _ProvincesService: ProvincesService,
        private _DistrictsService: DistrictsService,
        private _WardsService: WardsService,

    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = new FormGroup({
            idProvince: new FormControl('', Validators.compose([Validators.required])),
            idDistrict: new FormControl('', Validators.compose([Validators.required])),
            idWard: new FormControl('', Validators.compose([Validators.required])),
            address: new FormControl('', Validators.compose([Validators.required])),
            isPrimary: new FormControl(''),
        });
    }

    save() {
        this.isSaving = true;
        if (this.modelEdit.userId > 0) {
            this._UserAddressService.post(this.modelEdit)
                .then(response => {
                    if (response.status) {
                        this._notifierService.showSuccess('Cập nhật địa chỉ thành công!');
                        this.isShow = false;
                        this.closePopup.emit();
                    } else {
                        this.isSaving = false;
                        this._notifierService.showWarning('Cập nhật thông tin địa chỉ thất bại.\nNội dung lỗi: ' + response.message);
                    }
                })
                .catch(error => {
                    this.isSaving = false;
                    this._notifierService.showWarning('Có lỗi xảy ra: ' + Utilities.getErrorDescription(error));
                });
        }
    }

    async showPopup(item: any) {
        this.isShow = true;
        this.modelEdit = {};
        this.modelEdit.userId = item.userId;
        await this.onLoadProvinces();
        if (item.id > 0) {
            this.isLoading = true;
            this.item = item.id;
            this.isView = true;
            this._UserAddressService
                .getDetail(item.id)
                .then(async response => {
                    this.isLoading = false;
                    if (response.status) {
                        this.modelEdit = response.data;
                        await this.onLoadDistricts();
                        await this.onLoadWards();
                    }
                })
                .catch(error => {
                    this.isLoading = false;
                    this._notifierService.showWarning('Có lỗi xảy ra: ' + Utilities.getErrorDescription(error));
                });
        }
    }

    togglePopupDelete(): any {
        this.modelEdit = {};
    }


    async onLoadProvinces() {
        await this._ProvincesService.GetShort().then(rs => {
            if (rs.status) {
                this.province_options = rs.data;
            }
        });
    }

    async onLoadDistricts() {
        await this._DistrictsService.GetShort(this.modelEdit.idProvince).then(rs => {
            if (rs.status) {
                this.distric_options = rs.data;
            }
        });
    }

    async onLoadWards() {
        await this._WardsService.GetShort(this.modelEdit.idDistrict).then(rs => {
            if (rs.status) {
                this.ward_options = rs.data;
            }
        });
    }
}
