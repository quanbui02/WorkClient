import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { GiftsService } from '../services/vouchers.service';
import { GiftEditComponent } from './gift-edit/gift-edit.component';

@Component({
    selector: 'app-gift',
    templateUrl: './gift.component.html',
    styleUrls: ['./gift.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GiftComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        type: -1
    };
    type_options: any[];
    @ViewChild(GiftEditComponent) _GiftEditComponent: GiftEditComponent;

    constructor(
        protected _injector: Injector,
        private _GiftsService: GiftsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.loadTableColumnConfig();
        await this.getData();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'image',
                header: 'Hình ảnh',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'name',
                header: 'Tên',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'type',
                header: 'Loại',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'value',
                header: 'Giá trị',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'isActive',
                header: 'Trạng thái',
                visible: true,
                align: 'center',
                width: '8%',
                sort: true
            }
        ];
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._GiftsService.Gets(
            this.searchModel.key,
            this.searchModel.type,
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
        this._GiftEditComponent.showPopup(id);
    }

    onActive(item: any, e) {
        const obj = {
            id: item.id,
            isActive: e.checked
        };
        this._GiftsService.Active(obj).then(rs => {
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
