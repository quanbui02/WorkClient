import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserEditComponent } from '../edit/user-edit.component';
import { UserChangePwdComponent } from '../changepwd/user-changepwd.component';
import { UserRoleComponent } from '../user-role/user-role.component';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../lib-shared/services/user.service';
import { userInfo } from 'os';
@Component({
    selector: 'app-user-ctv-index',
    templateUrl: './user-ctv-index.component.html',
    styleUrls: ['./user-ctv-index.component.scss']
})
export class UserCTVIndexComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        trangThai: -1,
        idLevel: -1,
        isApproved: -1,
        idSupport: -1,
    };
    trangThai_options: any[];
    idLevel_options: any[];
    isApproved_options: any[];
    idSupport_options: any[];
    crrUser: any;

    @ViewChild(UserEditComponent) _userEdit: UserEditComponent;
    @ViewChild(UserRoleComponent) _userRole: UserRoleComponent;
    @ViewChild(UserChangePwdComponent) _changePwd: UserChangePwdComponent;
    constructor(
        protected _injector: Injector,
        private _userRoleService: UserService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.crrUser = await this._userRoleService.getCurrentUser();
        this.openSearchAdv = true;
        this.trangThai_options = [{ label: '-- Trạng thái --', value: -1 },
        { label: 'Chưa duyệt', value: 0 },
        { label: 'Đã duyệt', value: 1 }];

        this.limit = 10;
        this.loadStaticOptions();
        this.initDefaultOption();
        await this.loadDynamicOptionsAndGetData();
    }
    loadTableColumnConfig() {
        this.cols = [
            { field: 'userName', header: 'Tài khoản', visible: true, width: '80px', sort: true },
            { field: 'name', header: 'Tên hiển thị', visible: true, width: '120px', sort: true },
            { field: 'phone', header: 'Điện thoại', visible: true, width: '80px', sort: false },
            { field: 'email', header: 'Email', visible: true, width: '80px', sort: false },
            { field: 'domain', header: 'Web', visible: true, width: '80px', sort: false },
            { field: 'cmt', header: 'CMND', visible: true, width: '80px', sort: false },
            { field: 'cmtFront', header: 'CMND Mặt trước', visible: true, width: '80px', sort: false },
            { field: 'cmtBackside', header: 'CMND Mặt sau', visible: true, width: '80px', sort: false },
            { field: 'isApproved', header: 'Kích hoạt', visible: true, align: 'center', width: '40px', sort: false },
            { field: 'isApproveCmt', header: 'Xác minh danh tính', visible: true, align: 'center', width: '40px', sort: false },
            { field: 'isLogout', header: 'Bắt buộc logout', visible: true, align: 'center', width: '40px', sort: false },
            { field: 'idSupport', header: 'Người chăm sóc', visible: true, width: '80px', sort: false }
        ];
    }
    loadStaticOptions() {
        this.trangThai_options = [
            { label: '-- Trạng thái --', value: 0 },
            { label: 'Chờ xác minh', value: 1 },
            { label: 'Đã xác minh', value: 2 }
        ];

        this.isApproved_options = [
            { label: '-- Kích hoạt --', value: -1 },
            { label: 'Chờ kích hoạt', value: 0 },
            { label: 'Đã kích hoạt', value: 1 }
        ];

        this.idSupport_options = [
            { label: '-- Hỗ trợ --', value: -1 },
            { label: 'Thuộc hỗ trợ của tôi', value: this.crrUser.userId },
            { label: 'Chưa ai hỗ trợ', value: 0 }
        ];
    }
    initDefaultOption() {
        this.searchModel.key = '';
        this.searchModel.coSo = [];
        this.searchModel.namHoc = new Date().getFullYear();
        this.searchModel.hocKy = 1;
        this.searchModel.khoaHoc = [];
        this.searchModel.trangThai = 0;
    }
    async loadDynamicOptionsAndGetData() {
        this.getData();
        this.loadTableColumnConfig();
    }
    getData() {
        this.isLoading = true;
        this.dataSource = [];
        this._userRoleService.gets(this.searchModel.key, this.searchModel.trangThai, (this.page - 1) * this.limit, this.limit, this.sortField, false, this.searchModel.isApproved, this.searchModel.idSupport).then(rs => {
            if (rs.data) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
                this.isLoading = false;
            }
        }).catch(error => {
            this.isLoading = false;
            this._notifierService.showHttpUnknowError();
        });
        this.resetBulkSelect();
    }
    onSearch() {
        this.getData();
    }
    onEdit(id: number) {
        this._userEdit.showPopup(id);
    }
    onDelete(id: number) {
        this._notifierService.showConfirm('Bạn có chắc chắn muốn xóa người dùng này?', 'Xóa người dùng!').then(rs => {
            this._userRoleService.delete(id).then(re => {
                if (re.success) {
                    this._notifierService.showDeleteDataSuccess();
                    this.getData();
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }
    onPhanQuyen(item: any) {
        this._userRole.showPopup(item);
    }
    changePwd(item: any) {
        this._changePwd.showPopup(item);
    }
    toggleSearch() {
        super.toggleSearch();
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

    onAdminApproveCmt(item: any, e) {
        this._userRoleService.ApprovedCmt(item.userId, e).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Phê duyệt thành công');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    onAdminApprove(item: any, e) {
        this._userRoleService.Approved(item.userId, e).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Kích hoạt thành công');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    onAdminClient(item: any, e) {
        this._userRoleService.AdminClient(item.userId, e).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Thiết lập chủ doanh nghiệp thành công');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    onCheckLogout(item: any, e) {
        this._userRoleService.onSetLogout(item.userId, e).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Xử lý thành công');
            } else {
                this._notifierService.showError("Bạn không có quyền thực hiện thao tác này");
            }
        });
    }

    RemoveSupportCTV(item: any) {
        this._userRoleService.RemoveSupportCTV(item.userId).then(rs => {
            if (rs.status) {
                this.getData();
                this._notifierService.showSuccess('Hủy đăng ký thành công!');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
    }
    PickSupportCTV(item: any) {
        this._userRoleService.PickSupportCTV(item.userId).then(rs => {
            if (rs.status) {
                this.getData();
                this._notifierService.showSuccess('Đăng ký thành công!');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
    }
}
