import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../../../../lib-shared/services/user.service';
import { async } from '@angular/core/testing';
import { PointsService } from '../../../services/points.service';
import { SelectItem } from 'primeng/api';
import { BanksService } from '../../../services/banks.service';
import { User } from '../../../../lib-shared/models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-point-deposit-edit',
    templateUrl: './point-deposit-edit.component.html',
    styleUrls: ['./point-deposit-edit.component.scss']
})
export class PointDepositPersonalEditComponent extends SecondPageEditBase
    implements OnInit {
    isLoading = false;
    modelEdit: any = {};
    payment = 1;
    banks: SelectItem[];
    crrUser = new User();
    constructor(
        protected _injector: Injector,
        private _PointsService: PointsService,
        private _BanksService: BanksService,
        private activatedRoute: ActivatedRoute,
        private _UserService: UserService
    ) {
        super(null, _injector);
    }
    async ngOnInit() {
        this.formGroup = new FormGroup({
            payment: new FormControl('', Validators.compose([Validators.required])),
            deal: new FormControl('', Validators.compose([Validators.required, Validators.min(50000)])),
        });

        this.banks = [];
        this._BanksService.GetShort('').then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.banks.push({ label: item.name, value: item.id });
                });
            }
        });

    }
    save() {
        this.modelEdit.payment = this.payment;
        this.modelEdit.clientId = 2; // web
        this._PointsService.Deposit(this.modelEdit).then(rs => {
            if (rs.status) {
                // Nếu thanh toán qua ngân lượng thì chuyển sang trang ngân lượng để thanh toán
                if (this.payment === 1) {
                    window.location.href = rs.data;
                }
                this._notifierService.showSuccess('Tạo lệnh thành công');
                this.isShow = false;
                this.closePopup.emit();
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }
    async showPopup(id: any) {
        this.modelEdit = {};
        this.crrUser = await this._UserService.getCurrentUser();
        if (this.crrUser) {
            this.modelEdit.note = 'CC' + this.crrUser.userId;
            this.isLoading = false;
        } else { this.isLoading = true; return; }
        this.isShow = true;
    }
}


