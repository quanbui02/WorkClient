import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ClientsService } from '../../services/clients.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { User } from '../../../lib-shared/models/user';
import { DistrictsService } from '../../services/districts.service';
import { WardsService } from '../../services/wards.service';
import { ProvincesService } from '../../services/provinces.service';
import { GroupsService } from '../../services/groups.service';

@Component({
    selector: 'app-my-group',
    templateUrl: './my-group.component.html',
    styleUrls: ['./my-group.component.scss']
})
export class MyGroupComponent extends SecondPageEditBase implements OnInit {
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
        private _GroupsService: GroupsService,
        private userService: UserService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        await this.LoadInfo();
    }

    async LoadInfo() {
        this.users = [];
        this._GroupsService.MyGroup().then(async re => {
            this.modelEdit = re.data;
        }, error => {
            this._notifierService.showHttpUnknowError();
        });
    }

    togglePopupDelete(): any {
        this.modelEdit = {};
    }
}
