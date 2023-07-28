import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { GroupEditComponent } from '../group-edit/group-edit.component';
import { GroupsService } from '../../services/groups.service';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GroupComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        type: -1
    };
    type_options: any[];
    productInput: any = { KhoId: '-1', SaleId: '-1' };

    @ViewChild(GroupEditComponent) _GroupEditComponent: GroupEditComponent;

    constructor(
        protected _injector: Injector,
        private _GroupsService: GroupsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.loadTableColumnConfig();
        await this.loadCate();
        await this.getData();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'code',
                header: 'Mã nhóm',
                visible: true,
                align: 'center',
                width: '10%',
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
                field: 'link',
                header: 'Link',
                visible: true,
                sort: true
            },
            {
                field: 'isPrivate',
                header: 'Loại nhóm',
                visible: true,
                align: 'center',
                width: '8%',
                sort: true
            }
        ];
    }

    async loadCate() {
        this.type_options = [{ label: '-- Loại hướng dẫn --', value: -1 }];
        this.type_options.push({ label: 'Hướng dẫn bán hàng', value: 1 });
        this.type_options.push({ label: 'Hướng dẫn sử dụng', value: 2 });
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._GroupsService.Gets(
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

    onEdit(id: any) {
        this._GroupEditComponent.showPopup(id);
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
            this._GroupsService.delete(id).then(re => {
                if (re.status) {
                    this.dataSource = this.dataSource.filter(obj => obj.id !== id);
                    this._notifierService.showSuccess(rs.message);
                }
                else
                    this._notifierService.showError(re.message);
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    onActive(item: any, e) {
        const obj = {
            id: item.id,
            isActive: e
        };
        this._GroupsService.Active(obj).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    onActiveReward(item: any, e) {
        const obj = {
            id: item.id,
            isActiveReward: e
        };
        this._GroupsService.ActiveReward(obj).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
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
