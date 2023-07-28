import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../../../../lib-shared/services/user.service';
import { PointsService } from '../../../services/points.service';
import { SelectItem } from 'primeng/api';
import { BanksService } from '../../../services/banks.service';
import { User } from '../../../../lib-shared/models/user';
import { PointStatus } from '../../../common/constant';

@Component({
    selector: 'app-point-personal-edit',
    templateUrl: './point-personal-edit.component.html',
    styleUrls: ['./point-personal-edit.component.scss']
})
export class PointPersonalEditComponent extends SecondPageEditBase
    implements OnInit {
    isLoading = false;
    PointStatus = PointStatus;
    modelEdit: any = {};
    payment = 1;
    banks: SelectItem[];
    crrUser = new User();
    constructor(
        protected _injector: Injector,
        private _PointsService: PointsService,
        private _BanksService: BanksService,
        private _UserService: UserService
    ) {
        super(null, _injector);
    }
    async ngOnInit() {
        this.banks = [];
        this._BanksService.GetShort('').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.banks.push({ label: item.name, value: item.id });
                });
            }
        });
    }
    async showPopup(id: any) {
        this.modelEdit = {};
        if (id) {
            this._PointsService.getDetail(id).then(
                rs => {
                    if (rs.status) {
                        this.modelEdit = rs.data;
                    }
                }
            );

        }
        this.isShow = true;
    }
}


