
import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../lib-shared/classes/base/second-page-index-base';
import { LogsEditComponent } from './logs-edit/logs-edit.component';
import { LogsService } from './logs.service';

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LogsComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        serviceName: '',
        isActive: -1,
        type: -1
    };
    type_options: any[];

    @ViewChild(LogsEditComponent) _LogsEditComponent: LogsEditComponent;

    constructor(
        protected _injector: Injector,
        private _LogsService: LogsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.cols = [
            {
                field: 'createdDate',
                header: 'CreatedDate',
                visible: true,
                width: '8%',
                sort: true
            },
            {
                field: 'serviceName',
                header: 'ServiceName',
                visible: true,
                width: '5%',
                sort: true
            },
            {
                field: 'source',
                header: 'Source',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'path',
                header: 'Path',
                visible: true,
                sort: true
            },
            {
                field: 'url',
                header: 'Url',
                visible: true,
                sort: true
            },
            {
                field: 'message',
                header: 'Message',
                visible: true,
                sort: true
            },
            {
                field: 'data',
                header: 'Data',
                visible: false,
                sort: true
            },
            // {
            //     field: 'createdUserId',
            //     header: 'CreatedUserId',
            //     visible: true,
            //     width: '5%',
            //     sort: true
            // },
        ];
        await this.loadOptions();
        await this.getData();
    }

    async loadOptions() {
        this.type_options = [{ label: '-- Tất cả --', value: '' }];
        this.type_options.push({ label: 'dapfood.api', value: 'dapfood.api' });
        this.type_options.push({ label: 'linkorder', value: 'linkorder' });
        this.type_options.push({ label: 'notification.api', value: 'notification.api' });
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._LogsService.Gets(
            this.searchModel.key,
            this.searchModel.serviceName,
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

    onEdit(id: any) {
        this._LogsEditComponent.showPopup(id);
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
        //this.getData();
    }
}

