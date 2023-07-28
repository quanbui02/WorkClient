import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { User } from '../../../lib-shared/models/user';
import { UserService } from '../../../lib-shared/services/user.service';
import { GroupRegsService } from '../../services/groupregs.service';

@Component({
    selector: 'app-group-moi-thanh-vien',
    templateUrl: './group-moi-thanh-vien.component.html',
    styleUrls: ['./group-moi-thanh-vien.component.scss']
})
export class GroupMoiThanhVienComponent extends SecondPageEditBase
    implements OnInit {

    selectedItems = [];
    isLoading = false;
    type_options = [];
    users: any;
    userId: number;
    user = new User();

    constructor(
        protected _injector: Injector,
        private _GroupRegsService: GroupRegsService,
        private userService: UserService
    ) {
        super(null, _injector);
    }

    ngOnInit() {
        this.users = [];
    }
    onSelect(event) {
        this.user = event;
    }
    async autoComplete(event) {
        const query = event.query;
        await this.userService.SearchNotInGroup(query, 0, 10).then(rs => {
            if (rs.status) {
                this.users = rs.data;
                this.users.forEach(item => {
                    item.fullDisplayName = item.name + '(' + item.userName + ')';
                });
            }
        });
    }
    save() {
        this.isLoading = true;
        if (this.user.userId) {
            this.userId = this.user.userId;
        } else {
            this.userId = -1;
            this._notifierService.showError('Bạn chưa chọn thành viên!');
            return;
        }
        this._GroupRegsService.InviteMember(this.userId).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Gửi lời mời thành công!');
                this.isShow = false;
                this.users = [];
                this.closePopup.emit();
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.isLoading = false;
    }

    async showPopup() {
        this.users = [];
        this.user = new User();
        this.isShow = true;
    }
}