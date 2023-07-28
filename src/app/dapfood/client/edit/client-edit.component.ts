import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ClientsService } from '../../services/clients.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { User } from '../../../lib-shared/models/user';
import { ProvincesService } from '../../services/provinces.service';
import { DistrictsService } from '../../services/districts.service';
import { WardsService } from '../../services/wards.service';
@Component({
    selector: 'app-client-edit',
    templateUrl: './client-edit.component.html',
    styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent extends SecondPageEditBase implements OnInit {
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
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _ClientService: ClientsService,
        private userService: UserService,
        private _ProvincesService: ProvincesService,
        private _DistrictsService: DistrictsService,
        private _WardsService: WardsService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = new FormGroup({
            avatar: new FormControl(''),
            name: new FormControl('', Validators.compose([Validators.required])),
            phone: new FormControl('', Validators.compose([Validators.required])),
            email: new FormControl('', Validators.compose([])),
            address: new FormControl('', Validators.compose([])),
            users: new FormControl('', Validators.compose([Validators.required])),
            isSendSms: new FormControl('', Validators.compose([])),
            idProvince: new FormControl('', Validators.compose([Validators.required])),
            idDistrict: new FormControl('', Validators.compose([Validators.required])),
            idWard: new FormControl('', Validators.compose([Validators.required])),
            imageBanner: new FormControl('', Validators.compose([])),
            imageAbouts: new FormControl('', Validators.compose([])),
            sumRate: new FormControl('', Validators.compose([])),
            countRate: new FormControl('', Validators.compose([])),
            countComment: new FormControl('', Validators.compose([])),
            isAutoShip: new FormControl('', Validators.compose([])),
            description: new FormControl('', Validators.compose([])),
            feeBussiness: new FormControl('', Validators.compose([])),
            descriptionCart: new FormControl('', Validators.compose([])),
            shipLocation: new FormControl('', Validators.compose([])),
            shipDistance: new FormControl('', Validators.compose([])),
            extendDateOrder: new FormControl('', Validators.compose([])),
            isCheckInventory: new FormControl('', Validators.compose([])),
        });

    }
    async loadOptions() {
        await this.onLoadProvinces();
    }

    save() {
        this.isLoading = true;
        if (this.user.userId) {
            this.modelEdit.userId = this.user.userId;
        } else {
            this.modelEdit.userId = null;
        }
        this._ClientService.post(this.modelEdit).then(rs => {
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
        this.isShow = true;
        this.loadOptions();
        this.user = new User();
        if (data > 0) {
            this.users = [];
            this._ClientService.getDetail(data)
                .then(async response => {
                    this.modelEdit = response.data;
                    if (this.modelEdit.userId) {
                        this.userService.getDetail(this.modelEdit.userId).then(async rss => {
                            if (rss.status) {
                                this.user = rss.data;
                                await this.onLoadDistricts();
                                await this.onLoadWards();
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

    onSelect(event) {
        this.user = event;
    }
    async autoComplete(event) {
        const query = event.query;
        await this.userService.SearchNotInClient(query, 0, 10).then(rs => {
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
