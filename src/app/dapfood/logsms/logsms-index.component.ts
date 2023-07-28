import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { LogSmsService } from '../services/logsms.service';
@Component({
    selector: 'app-logsms-index',
    templateUrl: './logsms-index.component.html',
    styleUrls: ['./logsms-index.component.scss']
})
export class LogSmsIndexComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        trangThai: -1
    };
    trangThai_options: any[];
    support_options: any[];
    constructor(
        protected _injector: Injector,
        private _LogSmsService: LogSmsService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.openSearchAdv = true;
        this.trangThai_options = [{ label: '-- Trạng thái --', value: -1 },
        { label: 'Chưa active', value: 0 },
        { label: 'Đã active', value: 1 }];
        this.limit = 10;
        this.initDefaultOption();
        await this.loadDynamicOptionsAndGetData();
    }
    loadTableColumnConfig() {
        this.cols = [
            { field: 'phone', header: 'Điện thoại', visible: true, width: '80px', sort: false },
            { field: 'code', header: 'Mã', visible: true, width: '80px', sort: false },
            { field: 'createdDate', header: 'Ngày tạo', visible: true, width: '80px', sort: false }
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
        this._LogSmsService.Gets(this.searchModel.key, (this.page - 1) * this.limit, this.limit, this.sortField).then(rs => {
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
}
