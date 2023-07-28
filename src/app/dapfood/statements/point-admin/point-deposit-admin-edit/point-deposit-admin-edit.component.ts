import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { User } from '../../../../lib-shared/models/user';
import { UserService } from '../../../../lib-shared/services/user.service';
import { StatementsService } from '../../../services/statements.service';

@Component({
    selector: 'app-point-deposit-admin-edit',
    templateUrl: './point-deposit-admin-edit.component.html',
    styleUrls: ['./point-deposit-admin-edit.component.scss']
})
export class PointDepositAdminEditComponent extends SecondPageEditBase
    implements OnInit {
    isLoading = false;
    modelEdit: any = {};
    users: any;
    user = new User();
    total = 0;

    constructor(
        protected _injector: Injector,
        private userService: UserService,
        private _StatementsService: StatementsService
    ) {
        super(null, _injector);
    }
    ngOnInit() {
        this.formGroup = new FormGroup({
            fromUserId: new FormControl('', Validators.compose([Validators.required])),
            userId: new FormControl('', Validators.compose([Validators.required])),
            deal: new FormControl('', Validators.compose([Validators.required, Validators.min(1000)])),
            objectId: new FormControl(''),
            note: new FormControl('', Validators.compose([Validators.required])),
        });
    }

    onSelect(event) {
        this.user = event;
    }
    async autoComplete(event) {
        const query = event.query;
        await this.userService.gets(query, -1, 0, 50).then(rs => {
            if (rs.status) {
                this.users = rs.data;
                this.users.forEach(item => {
                    item.fullDisplayName = item.name + '(' + item.userName + ')';
                });
                this.total = rs.totalRecord;
            }
        });
    }

    save() {
        this.modelEdit.fromUserId = this.modelEdit.fromUserId.userId;
        this.modelEdit.userId = this.modelEdit.userId.userId;
        if (this.modelEdit.fromUserId === this.modelEdit.userId) {
            this._notifierService.showError("Cùng một người, không thực hiện được");
        }
        this._StatementsService.Transfer(this.modelEdit, 1).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Thực hiện thành công');
                this.isShow = false;
                this.closePopup.emit();
                this.modelEdit = {};
            }
            else {
                this._notifierService.showError(rs.message);
            }
        });
    }
    async showPopup(itemDetail: any) {
        this.modelEdit = {};
        this.isShow = true;
    }
}


