import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../../lib-shared/services/user.service';
@Component({
    selector: 'app-gioi-thieu-index',
    templateUrl: './gioi-thieu-index.component.html',
    styleUrls: ['./gioi-thieu-index.component.scss']
})
export class GioiThieuIndexComponent extends SecondPageIndexBase implements OnInit {
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
            { field: 'createdDate', header: 'Ngày tham gia', visible: true, width: '80px', sort: false }
        ];
    }
    loadStaticOptions() {
        this.trangThai_options = [
            { label: '-- Trạng thái --', value: -1 },
            { label: 'Chưa hỗ trợ', value: 0 },
            { label: 'Đã hỗ trợ', value: 1 }
        ];
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
    getData() {
        this.isLoading = true;
        this.dataSource = [];
        this._userRoleService.GetsInvited(this.searchModel.key, (this.page - 1) * this.limit, this.limit, this.sortField).then(rs => {
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
