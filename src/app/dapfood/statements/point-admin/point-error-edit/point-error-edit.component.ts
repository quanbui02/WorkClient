import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { PointStatus } from '../../../common/constant';
import { PointsService } from '../../../services/points.service';

@Component({
    selector: 'app-point-error-edit',
    templateUrl: './point-error-edit.component.html',
    styleUrls: ['./point-error-edit.component.scss']
})
export class PointErrorEditComponent extends SecondPageEditBase
    implements OnInit {
    isLoading = false;
    itemDetail: any = {};
    constructor(
        protected _injector: Injector,
        private _PointsService: PointsService
    ) {
        super(null, _injector);
    }
    ngOnInit() {
        this.formGroup = new FormGroup({
            note: new FormControl('', Validators.compose([Validators.required])),
        });
    }
    save() {
        if (this.itemDetail.status === PointStatus.KTDuyetThatBai) {
            this._PointsService.ProcessKT(this.itemDetail).then(rs => {
                if (rs.status) {
                    this._notifierService.showSuccess('Thực hiện thành công');
                    this.isShow = false;
                    this.closePopup.emit();
                    this.itemDetail = {};
                }
                else {
                    this._notifierService.showError(rs.message);
                }
            });
        }
        else if (this.itemDetail.status === PointStatus.AdminDuyetThatBai) {
            this._PointsService.ProcessAdmin(this.itemDetail).then(rs => {
                if (rs.status) {
                    this._notifierService.showSuccess('Thực hiện thành công');
                    this.isShow = false;
                    this.closePopup.emit();
                    this.itemDetail = {};
                }
                else {
                    this._notifierService.showError(rs.message);
                }
            });
        }
        else if (this.itemDetail.status === PointStatus.Loi) {
            this._PointsService.ProcessFinish(this.itemDetail).then(rs => {
                if (rs.status) {
                    this._notifierService.showSuccess('Thực hiện thành công');
                    this.isShow = false;
                    this.closePopup.emit();
                    this.itemDetail = {};
                }
                else {
                    this._notifierService.showError(rs.message);
                }
            });
        }
    }
    async showPopup(itemDetail: any) {
        this.itemDetail = itemDetail;
        this.isShow = true;
    }
}


