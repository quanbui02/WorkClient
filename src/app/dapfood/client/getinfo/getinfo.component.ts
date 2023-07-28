import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ClientsService } from '../../services/clients.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { User } from '../../../lib-shared/models/user';
import { DistrictsService } from '../../services/districts.service';
import { WardsService } from '../../services/wards.service';
import { ProvincesService } from '../../services/provinces.service';

@Component({
    selector: 'app-getinfo',
    templateUrl: './getinfo.component.html',
    styleUrls: ['./getinfo.component.scss']
})
export class GetinfoComponent extends SecondPageEditBase implements OnInit {
    modelEdit: any = {};
    isLoading = false;
    users: any;
    dataSource = [];
    key: string;
    total = 0;
    page = 1;
    limit = 100;
    user = new User();
    province_options: any[]; // = [{ label: '-- Tỉnh/TP --', value: 0 }];
    distric_options: any[]; // = [{ label: '-- Quận huyện--', value: 0 }];
    ward_options: any[]; // = [{ label: '-- Xã phường --', value: 0 }];

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _ClientService: ClientsService,
        private _DistrictsService: DistrictsService,
        private _ProvincesService: ProvincesService,
        private _WardsService: WardsService
    ) {
        super(null, _injector);
    }

    formGroup = new FormGroup({
        name: new FormControl('', Validators.compose([Validators.required])),
        phone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^((84|0[3|5|7|8|9])+([0-9]{8})\b)$/)])),
        address: new FormControl('', Validators.compose([Validators.required])),
        idProvince: new FormControl('', Validators.compose([Validators.required])),
        idDistrict: new FormControl('', Validators.compose([Validators.required])),
        idWard: new FormControl('', Validators.compose([Validators.required])),
    });

    async ngOnInit() {
        await this.onLoadProvinces();
        await this.LoadInfo();
        await this.onLoadDistricts();
        await this.onLoadWards();
    }

    async LoadInfo() {
        await this._ClientService.GetByToken().then(rs => {
            if (rs.status) {
                this.modelEdit = rs.data;
            } else {
                this._notifierService.showError(rs.message);
            }
            this.isLoading = false;
        });
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

    save() {
        this.isLoading = true;
        if (this.user.userId) {
            this.modelEdit.userId = this.user.userId;
        } else {
            this.modelEdit.userId = null;
        }
        this._ClientService.UpdateDonViAddress(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isShow = false;
            } else {
                this._notifierService.showError(rs.message);
            }
            this.isLoading = false;
        });
    }

    togglePopupDelete(): any {
        this.modelEdit = {};
    }
}
