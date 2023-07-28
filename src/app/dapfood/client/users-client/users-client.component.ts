import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { ClientsService } from '../../services/clients.service';
import { UserService } from '../../../lib-shared/services/user.service';
import { AppRolesService } from '../../../services/approles.service';
@Component({
    selector: 'app-users-client',
    templateUrl: './users-client.component.html',
    styleUrls: ['./users-client.component.scss']
})
export class UsersClientComponent extends SecondPageEditBase implements OnInit {
    active_options: any[];
    modelEdit: any = {};
    cols: any[];
    isLoading: any;
    dataSource: any;
    total: any;
    clientId: any;
    unassignedRoles: any[] = [];
    assignedRoles: any[] = [];
    dataRole: any;
    listRole: any[];
    listRolesGroup: any = [];
    constructor(
        protected _injector: Injector,
        private _ClientService: ClientsService,
        private _vaiTroService: AppRolesService,
        private userService: UserService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {

        this.cols = [
            {
                field: 'userId',
                header: 'Mã',
                visible: false,
                align: 'right',
            },
            {
                field: 'userName',
                header: 'Tài khoản',
                visible: true,
                align: 'right',
            },
            {
                field: 'name',
                header: 'Tên hiển thị',
                visible: true,
                align: 'right',
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
                visible: true,
                align: 'right',
            },
            {
                field: 'password',
                header: 'Mật khẩu',
                visible: true,
                align: 'right',
            },
            {
                field: 'roleName',
                header: 'Phòng ban',
                visible: true,
                align: 'right',
            },
            {
                field: 'actions',
                header: 'Thao tác',
                visible: true,
                align: 'center',
                width: '150px',
                sort: true
            }
        ];

        this.formGroup = new FormGroup({
            userName: new FormControl('', Validators.compose([Validators.required])),
            name: new FormControl('', Validators.compose([Validators.required])),
            phone: new FormControl('', Validators.compose([Validators.required])),
            email: new FormControl('', Validators.compose([Validators.required])),
            password: new FormControl('', Validators.compose([Validators.required])),
            roles: new FormControl('', Validators.compose([Validators.required])),

        });
    }

    async getListRole() {
        var lstRoleUser: any = [];
        this.listRolesGroup = [];
        await this._vaiTroService.search('DN', 1, 0, 9999).then(async rs => {
            if (rs.status) {
                lstRoleUser = rs.data;
            }
        });
        lstRoleUser.forEach(element => {
            this.listRolesGroup.push({ label: element.roleName, value: element.roleId });
        });
    }

    async showPopup(data: any = {}) {
        this.isShow = true;
        await this.getListRole();
        if (data > 0) {
            this.modelEdit.idClient = data;
            this.clientId = data;
            await this.getData();
        } else {
            this.togglePopupDelete();
        }
    }

    togglePopupDelete(): any {
        this.modelEdit = [];
        this.modelEdit.idClient = this.clientId;
        this.formGroup.reset();
    }

    async getData() {
        await this.userService.getUsersByIdClient(this.modelEdit.idClient).then(async rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.dataTotal;
            }
        });
        await this.getRoleName();
        await this.getRoleNameByUserId();
    }

    async getRoleName() {
        var lstUserId = '';
        for await (const item of this.dataSource) {
            lstUserId += item.userId + ',';
        }
        if (this.dataSource && this.dataSource.length > 0) {
            await this._vaiTroService.getUserRolesName(lstUserId).then(async rsR => {
                if (rsR.status) {
                    this.listRole = rsR.data;
                }
            });
        }
    }

    async getRoleNameByUserId() {
        this.dataSource.forEach(element => {
            element.roleName = this.listRole.filter(d => d.userId === element.userId).map(function (elem) { return elem.roleName; }).join(", ");
        });
    }

    onEdit(item: any) {
        item.isEdit = item.isEdit == true ? false : true;
    }

    async GetRoleName(userId) {
        this._vaiTroService.getUserRoles(userId).then(rs => {
            if (rs.status) {
                return rs.data;
            }
        });
    }

    async addNew() {
        if (!this.modelEdit.password || this.modelEdit.password.length < 6) {
            this._notifierService.showError("Mật khẩu quá ngắn");
        }
        this.modelEdit.userId = 0;
        this.modelEdit.RegType = 2;
        this.modelEdit.IdType = 2;
        this.modelEdit.Otp = "0000";
        this.modelEdit.idRole = this.modelEdit.roles;
        this.isLoading = true;
        await this.userService.CreateCB(this.modelEdit).then(async rs => {
            if (rs.status) {
                this._notifierService.showSuccess("Cập nhật thành công");
                this.togglePopupDelete();
                this.getData();
            }
            else
                this._notifierService.showError(rs.message);
            this.isLoading = false;
        });
    }

    onSave(item: any) {
        this.isLoading = true;
        this.userService.UpdateCB(item).then(rs => {
            if (rs.status) {
                item.isEdit = item.isEdit == true ? false : true;
                this._notifierService.showSuccess("Cập nhật thành công");
                this.getData();
            }
            else
                this._notifierService.showError(rs.message);
            this.isLoading = false;
        });
    }

    onDelete(item: any) {
        item.isDeleted = true;
        this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
            this.userService.UpdateCB(item).then(re => {
                if (re.status) {
                    this._notifierService.showDeleteDataSuccess();
                    this.dataSource = this.dataSource.filter(obj => obj.userId !== item.userId);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }
    toggleSearch() {
        this.fixTableScrollProblem();
    }
    onChangeRowLimit() {
        this.fixTableScrollProblem();
    }
    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    fixTableScrollProblem() {
        this.dataSource = [...this.dataSource];
    }
    onCloseForm() {
        this.getData();
    }
}