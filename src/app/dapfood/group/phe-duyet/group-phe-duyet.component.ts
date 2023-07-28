import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { ProductService } from '../../services/products.service';
import { ProductRegService } from '../../services/productregs.service';
import { EnumStatus } from '../../common/constant';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { GroupRegsService } from '../../services/groupregs.service';
import { GroupMoiThanhVienComponent } from '../moi-thanh-vien/group-moi-thanh-vien.component';

@Component({
    selector: 'app-group-phe-duyet',
    templateUrl: './group-phe-duyet.component.html',
    styleUrls: ['./group-phe-duyet.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GroupPheDuyetComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        trangThai: -1
    };

    trangThai_options: any[] = [];
    disabled = false;
    @ViewChild(GroupMoiThanhVienComponent) _GroupPheDuyetEditComponent: GroupMoiThanhVienComponent;

    constructor(
        protected _injector: Injector,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _GroupRegsService: GroupRegsService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.sortField = 'status';
        this.trangThai_options = [
            { label: '-- Trạng thái --', value: -1 },
            { label: 'Chờ duyệt', value: 0 },
            { label: 'Đã duyệt', value: 1 },
            { label: 'Từ chối', value: 2 }
        ];

        await this.getData();

        this.loadTableColumnConfig();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'name',
                header: 'Họ và tên CTV',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'createdDate',
                header: 'Ngày tham gia',
                visible: true,
                dataType: 'date',
                align: 'center',
                width: '10%',
                sort: true
            },
            {
                field: 'status',
                header: 'Trạng thái',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true
            }
        ];
    }
    async getData() {
        this.dataSource = [];
        this.isLoading = true;
        await this._GroupRegsService.Gets(
            this.searchModel.key,
            this.searchModel.trangThai,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        });
        console.log(159, this.dataSource.values);
        this.resetBulkSelect();
        this.isLoading = false;
    }
    onSearch() {
        this.getData();
    }
    onApprove(item: any) {
        this._notifierService.showConfirm('Bạn có chắc chắn phê duyệt đăng ký này?', 'Phê duyệt đăng ký nhóm').then(rs => {
            this._GroupRegsService.Approve(item.id, EnumStatus.Active).then(rs => {
                if (rs.status) {
                    item.status = 1;
                    this.getData();
                    this._notifierService.showSuccess('Phê duyệt thành công!');
                } else {
                    this._notifierService.showError(rs.message);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    onReject(item: any) {
        this._notifierService.showConfirm('Bạn có chắc chắn từ chối đăng ký này?', 'Từ chối đăng ký nhóm').then(rs => {
            this._GroupRegsService.Approve(item.id, EnumStatus.Reject).then(rs => {
                if (rs.status) {
                    item.status = 2;
                    this.getData();
                    this._notifierService.showSuccess('Từ chối thành công!');
                } else {
                    this._notifierService.showError(rs.message);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }
    onCancel(item: any) {
        this._notifierService.showConfirm('Bạn có chắc chắn hủy lời mời này?', 'Hủy lời mời gia nhập nhóm').then(rs => {
            this._GroupRegsService.CancelInvitation(item.id).then(rs => {
                if (rs.status) {
                    this.getData();
                    this._notifierService.showSuccess('Hủy lời mời thành công!');
                } else {
                    this._notifierService.showError(rs.message);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }
    onEdit() {
        this._GroupPheDuyetEditComponent.showPopup();
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
}
