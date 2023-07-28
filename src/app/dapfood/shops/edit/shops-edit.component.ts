import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ShopsService } from '../../services/shops.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { User } from '../../../lib-shared/models/user';
import { ProvincesService } from '../../services/provinces.service';
import { DistrictsService } from '../../services/districts.service';
import { WardsService } from '../../services/wards.service';
import { ClientsService } from '../../services/clients.service';
import { async } from '@angular/core/testing';
@Component({
    selector: 'app-shops-edit',
    templateUrl: './shops-edit.component.html',
    styleUrls: ['./shops-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShopsEditComponent extends SecondPageEditBase implements OnInit {
    modelEdit: any = {};
    isLoading = false;
    users: any;
    dataSource = [];
    key: string;
    total = 0;
    page = 1;
    limit = 100;
    user = new User();
    province_options: any[];
    distric_options: any[];
    ward_options: any[];
    shops_options: any[] = [];
    clients_options: any[] = [];
    unassignedWards: any[] = [];
    assignedWards: any[] = [];
    idTypeShop_option: any[] = [];
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _ShopsService: ShopsService,
        private userService: UserService,
        private _ProvincesService: ProvincesService,
        private _DistrictsService: DistrictsService,
        private _WardsService: WardsService,
        private _ClientsService: ClientsService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = new FormGroup({
            avatar: new FormControl(''),
            name: new FormControl('', Validators.compose([Validators.required])),
            code: new FormControl('', Validators.compose([Validators.required])),
            fullAddress: new FormControl('', Validators.compose([Validators.required])),
            phone: new FormControl('', Validators.compose([])),
            address: new FormControl('', Validators.compose([])),
            users: new FormControl(''),
            idProvince: new FormControl('', Validators.compose([Validators.required])),
            idDistrict: new FormControl('', Validators.compose([Validators.required])),
            idWard: new FormControl('', Validators.compose([Validators.required])),
            idWards: new FormControl('', Validators.compose([])),
            isDc: new FormControl('', Validators.compose([])),
            isShopBabi: new FormControl('', Validators.compose([])),
            isOpen: new FormControl('', Validators.compose([])),
            idDc: new FormControl('', Validators.compose([])),
            isShow: new FormControl('', Validators.compose([])),
            idClient: new FormControl('', Validators.compose([])),
            sort: new FormControl('', Validators.compose([])),
            lat: new FormControl('', Validators.compose([Validators.required])),
            lng: new FormControl('', Validators.compose([Validators.required])),
            idDistrictChange: new FormControl('', Validators.compose([])),
            noteShip: new FormControl('', Validators.compose([])),
            idTypeShop: new FormControl('', Validators.compose([])),
            neverSellOnline: new FormControl('', Validators.compose([])),
            addressShow: new FormControl('', Validators.compose([])),
            useLocationShip: new FormControl('', Validators.compose([])),
        });
    }
    async loadOptions() {
        this.shops_options = [];
        this.clients_options = [];
        await this.onLoadProvinces();
        await this.onLoadClient();
        await this.onLoadDCs();
        await this.loadTypeShop();
    }

    async GetFullAddress() {
        this.modelEdit.addressShow = this.modelEdit.address + ", "
            + this.ward_options.find(d => d.value == this.modelEdit.idWard).label
            + ", " + this.distric_options.find(d => d.value == this.modelEdit.idDistrict).label
            + ", " + this.province_options.find(d => d.value == this.modelEdit.idProvince).label;
    }

    async loadTypeShop() {
        this.idTypeShop_option.push({ label: '-- Loại cửa hàng --', value: -1 });
        this.idTypeShop_option.push({ label: 'Bapi', value: 1 });
        this.idTypeShop_option.push({ label: 'NQ', value: 2 });
        this.idTypeShop_option.push({ label: 'GT', value: 3 });
        this.idTypeShop_option.push({ label: 'Shop in Shop', value: 4 });
        this.idTypeShop_option.push({ label: 'MT', value: 5 });
        this.idTypeShop_option.push({ label: 'Horeca', value: 6 });
    }

    save() {
        this.isLoading = true;
        if (this.user.userId) {
            this.modelEdit.userId = this.user.userId;
        } else {
            this.modelEdit.userId = null;
        }
        const aWardIds: number[] = [];
        this.modelEdit.idWards = '';
        this.assignedWards.forEach((item) => {
            this.modelEdit.idWards += item.value + ';';
        });
        this._ShopsService.post(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isLoading = false;
                this.isShow = false;
                this.closePopup.emit();
            } else {
                this._notifierService.showError(rs.message);
                this.isLoading = false;
            }
        });
        this.isLoading = false;
    }

    async onLoadProvinces() {
        await this._ProvincesService.GetShort().then(rs => {
            if (rs.status) {
                this.province_options = rs.data;
            }
        });
    }

    async onLoadClient() {
        await this._ClientsService.GetShort("").then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.clients_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async onLoadDCs() {
        await this._ShopsService.GetShort("", 1, -1).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.shops_options.push({ value: item.id, label: item.name });
                });
            }
        });
    }

    async GetLocationShop() {
        this.modelEdit.fullAddress = this.modelEdit.address + ", "
            + this.ward_options.find(d => d.value == this.modelEdit.idWard).label
            + ", " + this.distric_options.find(d => d.value == this.modelEdit.idDistrict).label
            + ", " + this.province_options.find(d => d.value == this.modelEdit.idProvince).label;

        await this._ShopsService.GetLocationShop(this.modelEdit).then(rs => {
            if (rs.status) {
                this.modelEdit.lat = rs.data.lat;
                this.modelEdit.lng = rs.data.lng;
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

    async showPopup(data: any = {}) {
        this.modelEdit = [];
        this.assignedWards = [];
        this.isShow = true;
        this.user = new User();
        await this.loadOptions();
        if (data > 0) {
            this.users = [];
            await this._ShopsService.getDetail(data)
                .then(async response => {
                    this.modelEdit = response.data;
                    this.modelEdit.idDistrictChange = this.modelEdit.idDistrict;
                    await this.onLoadDistricts();
                    await this.onLoadWards();
                    await this.onLoadaWards();
                    if (this.modelEdit.userId) {
                        this.userService.getDetail(this.modelEdit.userId).then(async rss => {
                            if (rss.status) {
                                this.user = rss.data;
                            }
                        });
                    }
                }, error => {
                    this._notifierService.showHttpUnknowError();
                });
        } else {
            this.togglePopupDelete();
        }
    }

    async onLoadaWardsByDistrict() {

    }

    async onLoadaWards() {
        var ward_optionsChange: any;
        this.isLoading = false;

        await this._WardsService.GetShort(this.modelEdit.idDistrictChange).then(rs => {
            if (rs.status) {
                ward_optionsChange = rs.data;
            }
        });

        const wards = ward_optionsChange;
        var listId = '';
        listId = this.modelEdit.idWards + '';
        if (!listId || listId.length <= 0) {
            listId = this.modelEdit.idWard + '';
        }

        var wardsShop: any;
        await this._WardsService.GetShortByListId(listId).then(async rs => {
            if (rs.status) {
                wardsShop = rs.data;
            }
        });

        if (wardsShop && wardsShop.length > 0) {
            wardsShop.forEach(function (value) {
                if (wards.indexOf(d => d.value == value.value) === -1) {
                    wards.push(value);
                }
            });
        }

        Promise.all([wards, wardsShop]).then((responses) => {

            this.unassignedWards = responses[0];
            responses[1].forEach((x) => {
                this.assignedWards.push(x);
            });
        }).catch(error => { });
        this.isLoading = false;
    }

    onSelect(event) {
        this.user = event;
    }
    async autoComplete(event) {
        const query = event.query;
        await this.userService.SearchInClient(query, this.modelEdit.idClient, 0, 10).then(rs => {
            if (rs.status) {
                this.users = rs.data;
                this.users.forEach(item => {
                    item.fullDisplayName = item.name + '(' + item.userName + ')';
                });
                this.total = rs.totalRecord;
            }
        });
    }

    togglePopupDelete(): any {
        this.modelEdit = {};
    }
}
