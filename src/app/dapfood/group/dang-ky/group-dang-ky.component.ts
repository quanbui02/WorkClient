import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { GroupsService } from '../../services/groups.service';
import { GroupRegsService } from '../../services/groupregs.service';

@Component({
    selector: 'app-group-dang-ky',
    templateUrl: './group-dang-ky.component.html',
    styleUrls: ['./group-dang-ky.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GroupDangKyComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: ''
    };
    constructor(
        protected _injector: Injector,
        private _GroupsService: GroupsService,
        private _GroupRegsService: GroupRegsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.cols = [
            {
                field: 'code',
                header: 'Mã nhóm',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true
            },
            {
                field: 'name',
                header: 'Tên',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'description',
                header: 'Mô tả',
                visible: true,
                sort: true
            },
            {
                field: 'status',
                header: 'Trạng thái',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true
            },
        ];

        await this.getData();
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._GroupsService.GetsForReg(
            this.searchModel.key,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }
    onSearch() {
        this.getData();
    }
    onAccept(item: any) {
        this._GroupRegsService.AcceptInvitation(item.id).then(rs => {
            if (rs.status) {
                this.getData();
                this._notifierService.showSuccess('Gia nhập nhóm thành công!');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
    }
    onDecline(item: any) {
        this._GroupRegsService.DeclineInvitation(item.id).then(rs => {
            if (rs.status) {
                this.getData();
                this._notifierService.showSuccess('Từ chối thành công!');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
    }
    onRegister(item: any) {
        this._GroupRegsService.Register(item.id).then(rs => {
            if (rs.status) {
                this.getData();
                this._notifierService.showSuccess('Đăng ký thành công!');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
    }
    onCancel(item: any) {
        this._GroupRegsService.Cancel(item.id).then(rs => {
            if (rs.status) {
                this.getData();
                this._notifierService.showSuccess('Hủy thành công!');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
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
    }

}
