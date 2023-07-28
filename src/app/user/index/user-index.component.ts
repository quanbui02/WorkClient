import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserEditComponent } from '../edit/user-edit.component';
import { UserChangePwdComponent } from '../changepwd/user-changepwd.component';
import { UserRoleComponent } from '../user-role/user-role.component';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../lib-shared/services/user.service';
import { UserOmicallComponent } from '../omicall/user-omicall.component';
import { OmiCallsService } from '../../lib-shared/services/omicall.service';
@Component({
    selector: 'app-user-index',
    templateUrl: './user-index.component.html',
    styleUrls: ['./user-index.component.scss']
})
export class UserIndexComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        trangThai: -1,
        idLevel: -1,
        isApproved: -1,
        idClient: -1,
    };
    trangThai_options: any[];
    idLevel_options: any[];
    isApproved_options: any[];
    idClient_options: any[];

    @ViewChild(UserEditComponent) _userEdit: UserEditComponent;
    @ViewChild(UserOmicallComponent) _userOmicall: UserOmicallComponent;
    @ViewChild(UserRoleComponent) _userRole: UserRoleComponent;
    @ViewChild(UserChangePwdComponent) _changePwd: UserChangePwdComponent;

    constructor(
        protected _injector: Injector,
        private _userRoleService: UserService,
        private _omiCallsService: OmiCallsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
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
            { field: 'isAdminClient', header: 'Chủ doanh nghiệp', visible: true, align: 'center', width: '40px', sort: false },
            { field: 'isLogout', header: 'Bắt buộc logout', visible: true, align: 'center', width: '40px', sort: false },
            { field: 'isKol', header: 'Cộng tác viên', visible: true, align: 'center', width: '40px', sort: false },
            { field: 'roleNames', header: 'Vai trò', visible: true, width: '180px', sort: false },
            { field: 'idSupport', header: 'Người chăm sóc', visible: true, width: '80px', sort: false },
            { field: 'isOmiCall', header: 'Đồng bộ OmiCall', visible: true, width: '100px', sort: false }
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

        this.idClient_options = [
            { label: '-- Loại tài khoản --', value: -1 },
            { label: 'Cộng tác viên', value: 0 },
            { label: 'Thuộc doanh nghiệp', value: 1 }
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
        this._userRoleService.gets(this.searchModel.key, this.searchModel.trangThai, (this.page - 1) * this.limit, this.limit, this.sortField, false, this.searchModel.isApproved, this.searchModel.idClient).then(rs => {
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

    onOmicall(item: any) {
        console.log("show __" + item)
        this._userOmicall.showPopup(item);
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

    PickKol(item: any) {
        if (item.isKol && item.isKol === true) {
            this._userRoleService.PickKol(item.userId).then(rs => {
                if (rs.status) {
                    this.getData();
                    this._notifierService.showSuccess('Cập nhật CTV thành công!');
                } else {
                    this._notifierService.showError(rs.message);
                }
            });
        } else {
            this._userRoleService.RemovePickKol(item.userId).then(rs => {
                if (rs.status) {
                    this.getData();
                    this._notifierService.showSuccess('Hủy CTV thành công!');
                } else {
                    this._notifierService.showError(rs.message);
                }
            });
        }
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
    RemoveUserOmicall(item: any) {
        if (!item.email || item.email === '') {
            this._notifierService.showWarning('Người dùng không tồn tại thư điện tử!');
            return;
        }
        this._omiCallsService.OmicallAgentDelete(item.email).then(omicallresponse => {
            if (omicallresponse.status) {
                if (omicallresponse.data.status_code == 9999) {
                    item.IsOmiCall = false;
                    this._userRoleService.UpdateOmicall(item).then(rs => {
                        if (rs.status) {
                            this.getData();
                            this._notifierService.showSuccess('Hủy đồng bộ thành công!');
                        } else {
                            this._notifierService.showError(rs.message);
                        }
                    });
                }
                else {
                    this._notifierService.showError(omicallresponse.data.message);
                }
            }
            else {
                this._notifierService.showError(omicallresponse.message);
            }
        });
        this.resetBulkSelect();
    }

}
