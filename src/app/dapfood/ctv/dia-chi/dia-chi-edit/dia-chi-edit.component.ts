import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { UserAddressUserService } from '../../../services/useraddressUser.service';
import { ProvincesService } from '../../../services/provinces.service';
import { DistrictsService } from '../../../services/districts.service';
import { WardsService } from '../../../services/wards.service';

@Component({
    selector: 'app-dia-chi-edit',
    templateUrl: './dia-chi-edit.component.html',
    styleUrls: ['./dia-chi-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DiaChiEditComponent extends SecondPageEditBase
    implements OnInit {
    key: string;
    isNew = false;
    isLoading = false;
    modelEdit: any = {
        idType: 1,
        idProvince: 0,
        idDistrict: 0,
        idWard: 0,
        name: '',
        phone: '',
        address: '',
        fullAddress: '',
        isDefault: false,
    };
    type_options: any;
    fullAddressMul: any[];
    results: any;
    total = 0;
    idProvince = 0;
    idDistrict = 0;
    idWard = 0;
    dataSource = [];
    dataSource3 = [];
    dataCity = [];
    province_options: any[];
    distric_options: any[];
    ward_options: any[];
    isDefault = 0;
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _UserAddressUserService: UserAddressUserService,
        private _ProvincesService: ProvincesService,
        private _DistrictsService: DistrictsService,
        private _WardsService: WardsService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            name: new FormControl('', Validators.compose([Validators.required])),
            phone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^((84|0[3|5|7|8|9])+([0-9]{8})\b)$/)])),
            address: new FormControl('', Validators.compose([Validators.required])),
            idType: new FormControl(''),
            fullAddress: '',
            isDefault: new FormControl(''),
            idProvince: new FormControl('', Validators.compose([Validators.required])),
            idDistrict: new FormControl('', Validators.compose([Validators.required])),
            idWard: new FormControl('', Validators.compose([Validators.required])),
        });
        this.type_options = [{ label: 'Nhà riêng', value: 1 },
        { label: 'Văn phòng', value: 2 },];

        await this.onLoadProvinces();
    }

    save() {
        this.modelEdit.fullAddress = this.modelEdit.address + ", "
            + this.ward_options.find(d => d.value == this.modelEdit.idWard).label
            + ", " + this.distric_options.find(d => d.value == this.modelEdit.idDistrict).label
            + ", " + this.province_options.find(d => d.value == this.modelEdit.idProvince).label;
        this._UserAddressUserService.post(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isShow = false;
                this.closePopup.emit();
                this.modelEdit = {};
                this.dataSource = [];
                this.formGroup.reset();
            } else {
                this._notifierService.showError(rs.message);
            }
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
        this.ward_options = [];
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

    async autoComplete(event) {
        const query = event.query;
        if (this.dataSource != null) {
            if (this.idProvince <= 0 && this.dataSource && this.dataSource.length >= 1) {
                this.idProvince = this.dataSource[0].id;
            }
            if (this.idDistrict <= 0 && this.dataSource && this.dataSource.length >= 2) {
                this.idDistrict = this.dataSource[1].id;
            }
            if (this.idWard <= 0 && this.dataSource && this.dataSource.length >= 3) {
                this.idWard = this.dataSource[2].id;
            }
        }
        if (this.idWard <= 0 || this.idProvince <= 0 || this.idDistrict <= 0) {
            await this._ProvincesService.Autocomplete(query, this.idProvince, this.idDistrict, this.idWard, 0, 20).then(rs => {
                if (rs.status) {
                    this.results = rs.data;
                    this.total = rs.totalRecord;
                }
            });
        } else {
            if (this.dataSource.length === 3 && query && query.length > 3 && this.dataSource3.length < 1) {
                this.dataSource3.push({ id: 0, code: '', name: query })
            } else if (this.dataSource3.length === 1) {
                this.dataSource3[0].name = query;
            }
        }
    }

    onBlur(event) {
        this.modelEdit.address = this.dataSource3[0] ? this.dataSource3[0].name : this.modelEdit.address;
    }

    onSelect(event) {
        //this.dataSource.push(event);
        if (this.idProvince <= 0 && this.dataSource && this.dataSource.length >= 1) {
            this.idProvince = this.dataSource[0].id;
        }
        if (this.idDistrict <= 0 && this.dataSource && this.dataSource.length >= 2) {
            this.idDistrict = this.dataSource[1].id;
        }
        if (this.idWard <= 0 && this.dataSource && this.dataSource.length >= 3) {
            this.idWard = this.dataSource[2].id;
        }
        event.quantity += 1;
        this.key = null;
    }

    onClear(event) {
        this.dataSource.splice(this.dataSource.indexOf(event), 1);
        if (this.idProvince <= 0 && this.dataSource && this.dataSource.length >= 1) {
            this.idProvince = this.dataSource[0].id;
        }
        if (this.idDistrict <= 0 && this.dataSource && this.dataSource.length >= 2) {
            this.idDistrict = this.dataSource[1].id;
        }
        if (this.idWard <= 0 && this.dataSource && this.dataSource.length >= 3) {
            this.idWard = this.dataSource[2].id;
        }
        event.quantity -= 1;
        this.key = null;
    }

    async showPopup(id: any) {
        this.isShow = true;
        if (id > 0) {
            await this._UserAddressUserService.getDetail(id)
                .then(async response => {
                    if (response.status) {
                        this.modelEdit = response.data;
                        await this.onLoadDistricts();
                        await this.onLoadWards();
                        this.isNew = false;
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        } else {
            this.isNew = true;
            this.modelEdit = { idType: 1 };
        }
    }
}




