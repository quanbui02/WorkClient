import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { DealTypesService } from '../../services/dealtypes.service';
import { StatementsService } from '../../services/statements.service';
import * as moment from "moment";
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';
import { OrderEditComponent } from '../../ctv/orders/order-edit/order-edit.component';
import { PointPersonalEditComponent } from '../point-personal/point-personal-edit/point-personal-edit.component';

@Component({
    selector: 'app-statements-histories',
    templateUrl: './statements-histories.component.html',
    styleUrls: ['./statements-histories.component.scss']
})
export class StatementHistoriesComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        dealtype: -1,
        status: -1
    };
    dealType_options: any[] = [];
    trangThai_options: any[] = [];

    colFilter: any = {};

    disabled = false;
    vi: any;
    fromDate: Date;
    toDate: Date;
    @ViewChild(OrderEditComponent) _orderEdit: OrderEditComponent;
    @ViewChild(PointPersonalEditComponent) _PointPersonalEditComponent: PointPersonalEditComponent;

    constructor(
        protected _injector: Injector,
        private _DealTypesService: DealTypesService,
        private _configurationService: ConfigurationService,
        private _StatementsService: StatementsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        registerLocaleData(vi);
        await this.loadDealType();
        await this.getData();
        this.loadTableColumnConfig();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'createdDate',
                header: 'Ngày giao dịch',
                visible: true,
                width: '150px',
                dataType: 'date',
                align: 'center',
                sort: false,
            },
            {
                field: 'dealTypeName',
                header: 'Loại giao dịch',
                visible: true,
                sort: true
            },
            {
                field: 'note',
                header: 'Nội dung',
                visible: true,
                sort: true
            },
            {
                field: 'type',
                header: 'Nhóm',
                visible: true,
                width: '120px',
                sort: true
            },
            {
                field: 'objectId',
                header: 'Mã tham chiếu',
                visible: true,
                width: '120px',
                align: 'center',
                sort: true
            },
            {
                field: 'balanceBefore',
                header: 'Số dư đầu',
                dataType: 'number',
                visible: true,
                width: '120px',
                align: 'right',
                sort: true
            },
            {
                field: 'deal',
                header: 'Số xu cộng',
                dataType: 'number',
                visible: true,
                width: '120px',
                align: 'right',
                sort: true
            },
            {
                field: 'negativeDeal',
                header: 'Số xu trừ',
                dataType: 'number',
                visible: true,
                width: '120px',
                align: 'right',
                sort: true
            },
            {
                field: 'balance',
                header: 'Số dư cuối',
                dataType: 'number',
                visible: true,
                width: '120px',
                align: 'right',
                sort: true
            }
        ];

        this.trangThai_options = [
            { label: '-- Trạng thái --', value: -1 },
            { label: 'Chưa xử lý', value: 0 },
            { label: 'Thành công', value: 1 },
            { label: 'Đang xử lý', value: 2 },
            { label: 'Hủy', value: 3 },
            { label: 'Lỗi', value: 4 }
        ];
    }

    async loadDealType() {
        this.dealType_options = [{ label: '-- Loại giao dịch --', value: -1 }];
        await this._DealTypesService.Gets('', 0, 1000).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.dealType_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }

    async getData() {
        this.isLoading = true;
        if (this.fromDate) this.fromDate = new Date(this.fromDate);
        if (this.toDate) this.toDate = new Date(this.toDate);
        this.dataSource = [];
        await this._StatementsService.GetsCurrentUser(
            this.searchModel.key,
            this.searchModel.dealtype,
            this.searchModel.status,
            this.fromDate,
            this.toDate,
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
    toggleSearch() {
        super.toggleSearch();
        this.fixTableScrollProblem();
    }
    onChangeRowLimit() {
        this.fixTableScrollProblem();
    }
    fixTableScrollProblem() {
        this.dataSource = [...this.dataSource];
    }

    customSort(event: SortEvent) {
        event.data.sort((data1, data2) => {
            const value1 = data1[event.field];
            const value2 = data2[event.field];
            let result = null;

            if (value1 == null && value2 != null) {
                result = -1;
            } else if (value1 != null && value2 == null) {
                result = 1;
            } else if (value1 == null && value2 == null) {
                result = 0;
            } else if (typeof value1 === 'string' && typeof value2 === 'string') {
                result = value1.localeCompare(value2);
            } else {
                result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
            }

            return (event.order * result);
        });
    }

    formatNumber(i): string {
        try {
            const t = +i.toFixed(2);
            return (t).toLocaleString('vi-vn', { minimumFractionDigits: 0 });
        } catch {
            return '0';
        }
    }

    onShowOrder(id: any) {
        this._orderEdit.showPopup(id);
    }
    onShowPoint(id: any) {
        this._PointPersonalEditComponent.showPopup(id);
    }
}
