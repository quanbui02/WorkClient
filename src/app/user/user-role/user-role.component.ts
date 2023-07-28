import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageEditBase } from '../../lib-shared/classes/base/second-page-edit-base';
import { Utilities } from '../../shared/utilities';
import { AppRolesService } from '../../services/approles.service';
import { UserService } from '../../lib-shared/services/user.service';

@Component({
    selector: 'app-user-role',
    templateUrl: './user-role.component.html',
    styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent extends SecondPageEditBase implements OnInit {
    isLoading = false;
    isSaving = false;
    unassignedRoles: any[] = [];
    assignedRoles: any[] = [];
    item: any;
    header = '';
    constructor(
        protected _injector: Injector,
        private _vaiTroService: AppRolesService,
        private _UserService: UserService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {

    }

    async loadOptions() {
    }

    save() {
        const roleIds: number[] = [];
        const userIds: number[] = [];

        this.isSaving = true;
        this.assignedRoles.forEach((item) => {
            roleIds.push(item.roleId);
        });
        userIds.push(this.item.userId);

        this._vaiTroService.assignUsersToRoles(userIds, roleIds).then((response) => {
            if (response.status) {
                // Bắt buộc logout
                this._UserService.onSetLogout(this.item.userId, true).then(rs => {
                    if (rs.status) {
                        this._notifierService.showSuccess('Buộc logout thành công');
                    } else {
                        this._notifierService.showError("Bạn không có quyền thực hiện thao tác này");
                    }
                });
                this._notifierService.showSuccess('Gán quyền thành công!');
                this.reset();
                this.isShow = false;
                this.closePopup.emit();
            } else {
                this.isSaving = false;
                this._notifierService.showWarning('Cập nhật dữ liệu thất bại.\nNội dung lỗi: ' + response.code);
            }
        }).catch(error => {
            this.isLoading = false;
            this._notifierService.showError(Utilities.getErrorDescription(error));
        });
    }

    async showPopup(item: any) {
        this.isShow = true;
        this.loadOptions();
        // if (id > 0) {
        //     this._vaiTroService.getDetail(id)
        //         .then(async response => {
        //             this.modelEdit = response.data;
        //         }, error => {
        //             this._notifierService.showHttpUnknowError();
        //         });
        // }
        if (item) {
            this.item = item;
            this.header = 'Gán vai trò người dùng: ' + (item.name || item.userName);
            this.isLoading = true;
            const roles = this._vaiTroService.search('', 1, 0, 9999);
            const userRoles = this._vaiTroService.getUserRoles(this.item.userId);

            Promise.all([roles, userRoles]).then((responses) => {
                this.isLoading = false;

                this.unassignedRoles = responses[0].data;

                responses[1].data.forEach((x) => {
                    this.assignedRoles.push(x.role);
                });
            }).catch(error => {
                this.isLoading = false;
                this._notifierService.showError(Utilities.getErrorDescription(error));
            });
        }

    }
    reset() {
        this.item = null;
        this.isLoading = false;
        this.isSaving = false;
        this.unassignedRoles = [];
        this.assignedRoles = [];
    }

    cancel() {
        this.reset();
    }

}
