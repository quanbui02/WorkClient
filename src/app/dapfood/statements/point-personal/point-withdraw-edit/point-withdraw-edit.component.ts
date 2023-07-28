import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { PointsService } from '../../../services/points.service';
import { UserService } from '../../../../lib-shared/services/user.service';
import { User } from '../../../../lib-shared/models/user';
import { BanksService } from '../../../services/banks.service';
import { SelectItem } from 'primeng/api';
import { LogSmsService } from '../../../services/logsms.service';
import { StatementsService } from '../../../services/statements.service';

@Component({
    selector: 'app-point-withdraw-edit',
    templateUrl: './point-withdraw-edit.component.html',
    styleUrls: ['./point-withdraw-edit.component.scss']
})
export class RutDiemCaNhanEditComponent extends SecondPageEditBase
    implements OnInit {
    isLoading = false;
    modelEdit: any = {};
    crrUser = new User();
    banks: SelectItem[];
    code: string;
    fee = 0;
    soDuKhaDung = 0;
    balance = 0;
    cashInTransit = 0;
    lastDeal = 0;
    totalDeal = 0;
    tax = 0;
    isSupportAtm = false;
    isSupportBank = false;
    constructor(
        protected _injector: Injector,
        private _PointsService: PointsService,
        private _LogSmsService: LogSmsService,
        private _BanksService: BanksService,
        private _UserService: UserService,
        private _StatementsService: StatementsService,

    ) {
        super(null, _injector);
    }
    ngOnInit() {
        this.formGroup = new FormGroup({
            deal: new FormControl('', Validators.compose([Validators.required, Validators.min(100000)])),
            isSupportBank: new FormControl(''),
            isSupportAtm: new FormControl(''),
            payment: new FormControl(''),
            code: new FormControl('', Validators.compose([Validators.required]))
        });

        // this.banks = [];
        // this._BanksService.GetShort('').then(rs => {
        //     if (rs.status) {
        //         rs.data.forEach(item => {
        //             this.banks.push({ label: item.name, value: item.id });
        //         });
        //     }
        // });
    }
    onChangeDeal() {
        if (!this.crrUser.idClient) {
            if (this.modelEdit.deal >= 2000000) {
                this.tax = this.modelEdit.deal / 10;
            }
        }

        this.totalDeal = +this.modelEdit.deal + this.fee;
        this.lastDeal = +this.modelEdit.deal - this.tax;
    }
    save() {
        if (!this.modelEdit.accountType) {
            this._notifierService.showError('Ngân hàng này không hỗ trợ rút xu!');
            return;
        }
        if (this.modelEdit.accountType === 3) {
            if (!this.modelEdit.bankCode) {
                this._notifierService.showError('Bạn phải cập nhật thông tin ngân hàng!');
                return;
            }
        }
        if (this.modelEdit.accountType === 1) {
            this.modelEdit.payment = 2;
        } else {
            this.modelEdit.payment = 1;
        }
        this._PointsService.Withdraw(this.modelEdit, this.code).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
                this.isShow = false;
                this.closePopup.emit();
                this.code = '';
                this.modelEdit.deal = 0;
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    GetOTP() {
        this._LogSmsService.GetOtp(1).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    async showPopup(id: any) {
        this.isLoading = true;
        this.modelEdit = {};
        this.fee = 0;
        this.lastDeal = 0;
        this.tax = 0;
        this._PointsService.GetWithdrawFee().then(rs => {
            if (rs.status) {
                this.fee = rs.data;
            }
        });
        this.crrUser = await this._UserService.getCurrentUser();
        if (this.crrUser) {
            await this._StatementsService.GetBalance().then(rs => {
                if (rs.status) {
                    this.balance = rs.data.balance;
                    this.cashInTransit = rs.data.cashInTransit;
                    this.soDuKhaDung = this.balance - this.cashInTransit;
                }
            });

            if (this.crrUser.bankBranch) {
                this.modelEdit.bankBranch = this.crrUser.bankBranch;
            }
            if (this.crrUser.bankFullName) {
                this.modelEdit.bankFullName = this.crrUser.bankFullName;
            }
            if (this.crrUser.bankNumber) {
                this.modelEdit.bankNumber = this.crrUser.bankNumber;
            }
            if (this.crrUser.bankCardNumber) {
                this.modelEdit.bankCardNumber = this.crrUser.bankCardNumber;
            }
            if (this.crrUser.idBankNavigation) {
                if (this.crrUser.idBankNavigation.code) {
                    this.modelEdit.bankCode = this.crrUser.idBankNavigation.code;
                }
            }
            if (this.crrUser.idBank) {
                this._BanksService.getDetail(this.crrUser.idBank).then(rs => {
                    this.isLoading = false;
                    this.modelEdit.bankName = rs.data.name;
                    this.isSupportAtm = rs.data.isSupportAtm && this.modelEdit.bankCardNumber;
                    this.isSupportBank = rs.data.isSupportBank && this.modelEdit.bankNumber;
                    if (this.isSupportBank) {
                        this.modelEdit.accountType = 3;
                    } else {
                        if (this.isSupportAtm) {
                            this.modelEdit.accountType = 2;
                        } else {
                            this._notifierService.showError('Ngân hàng này không hỗ trợ rút xu!');
                        }
                    }
                });
            } else {
                this._notifierService.showError('Không có thông tin ngân hàng!');
                return;
            }
        }
        this.isShow = true;
    }
}


