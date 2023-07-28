import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../../lib-shared/services/user.service';
@Component({
    selector: 'app-group-tag',
    templateUrl: './group-tag.component.html',
    styleUrls: ['./group-tag.component.scss']
})
export class GroupTagComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        trangThai: -1
    };
    trangThai_options: any[];
    support_options: any[];
    constructor(
        protected _injector: Injector,
        private _userRoleService: UserService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.openSearchAdv = true;
        this.trangThai_options = [{ label: '-- Trạng thái --', value: -1 },
        { label: 'Chưa hỗ trợ', value: 0 },
        { label: 'Đã hỗ trợ', value: 1 }];
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
            { field: 'idSupport', header: 'Người hỗ trợ', visible: true, width: '80px', sort: false }
        ];
    }
    loadStaticOptions() {
        this.trangThai_options = [
            { label: '-- Trạng thái --', value: -1 },
            { label: 'Chưa hỗ trợ', value: 0 },
            { label: 'Đã hỗ trợ', value: 1 }
        ];
        this.loadSupport();
    }
    initDefaultOption() {
        this.searchModel.key = '';
        this.searchModel.trangThai = 0;
        this.searchModel.idSuport = -1;
    }
    async loadDynamicOptionsAndGetData() {
        this.getData();
        this.loadTableColumnConfig();
    }
    async loadSupport() {
        this.support_options = [];
        this.support_options.push({ label: '-- Người hỗ trợ --', value: -1 });
        await this._userRoleService.GetByRoleName('CSKH', 20, 1000).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.support_options.push({ label: item.username, value: item.userId });
                });
            }
        });
    }
    getData() {
        this.isLoading = true;
        this.dataSource = [];
        this._userRoleService.GetsForSupport(this.searchModel.key, this.searchModel.idSupport, this.searchModel.trangThai, (this.page - 1) * this.limit, this.limit, this.sortField).then(rs => {
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
    RemoveSupportCTVForAdmin(item: any) {
        this._userRoleService.RemoveSupportCTVForAdmin(item.userId).then(rs => {
            if (rs.status) {
                this.getData();
                this._notifierService.showSuccess('Hủy đăng ký thành công!');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
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
