import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { LevelsService } from '../services/levels.service';
import { LevelEditComponent } from './level-edit/level-edit.component';

@Component({
    selector: 'app-level',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LevelComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        isActive: -1,
        type: -1
    };
    active_options: any[];
    productInput: any = { KhoId: '-1', SaleId: '-1' };

    @ViewChild(LevelEditComponent) _LevelEditComponent: LevelEditComponent;

    constructor(
        protected _injector: Injector,
        private _LevelsService: LevelsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.loadTableColumnConfig();
        await this.loadActiveOptions();
        await this.getData();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'name',
                header: 'Tên',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'description',
                header: 'Mô tả',
                visible: true,
                width: '90%',
                sort: true
            },
            // {
            //     field: 'sort',
            //     header: 'Thứ tự',
            //     visible: true,
            //     align: 'center',
            //     width: '5%',
            //     sort: true
            // },
            // {
            //     field: 'isActive',
            //     header: 'Trạng thái',
            //     visible: true,
            //     align: 'center',
            //     width: '8%',
            //     sort: true
            // }
        ];
    }

    async loadActiveOptions() {
        this.active_options = [{ label: '-- Trạng thái --', value: -1 }];
        this.active_options.push({ label: 'Không sử dụng', value: 0 });
        this.active_options.push({ label: 'Sử dụng', value: 1 });
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._LevelsService.Gets(
            this.searchModel.key,
            this.searchModel.isActive,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
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
        this._LevelEditComponent.showPopup(id);
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Xóa bản ghi ?', 'Bạn có chắc muốn xóa bản ghi này ?').then(rs => {
            this._LevelsService.delete(id).then(re => {
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
            isActive: e.checked
        };
        this._LevelsService.Active(obj).then(rs => {
            this._notifierService.showSuccess(rs.message);
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


