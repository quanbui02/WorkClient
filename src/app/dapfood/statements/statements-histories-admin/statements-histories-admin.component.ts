import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { DealTypesService } from '../../services/dealtypes.service';
import { StatementsService } from '../../services/statements.service';
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';
import { UserService } from '../../../lib-shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { PointPersonalEditComponent } from '../point-personal/point-personal-edit/point-personal-edit.component';
import { OrderClientEditComponent } from './../../doanh-nghiep/order-client/order-client-edit/order-client-edit.component';
// import { OrderAdminEditComponent } from '../../admin/order-admin/order-admin-edit/order-admin-edit.component';

@Component({
    selector: 'app-statements-histories-admin',
    templateUrl: './statements-histories-admin.component.html',
    styleUrls: ['./statements-histories-admin.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StatementHistoriesAdminComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        dealType: -1,
        userId: -1,
        status: -1,
        fromDate: new Date(),
        toDate: new Date(),
    };
    dealType_options: any[] = [];
    trangThai_options: any[] = [];
    openSearchAdv = true;
    colFilter: any = {};
    users: any;
    user: any;
    disabled = false;
    vi: any;
    @ViewChild(OrderClientEditComponent) _orderEdit: OrderClientEditComponent;
    @ViewChild(PointPersonalEditComponent) _PointPersonalEditComponent: PointPersonalEditComponent;

    constructor(
        protected _injector: Injector,
        private activatedRoute: ActivatedRoute,
        private _DealTypesService: DealTypesService,
        private _configurationService: ConfigurationService,
        private _StatementsService: StatementsService,
        private _UserService: UserService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        registerLocaleData(vi);
        await this.loadDealType();
        this.activatedRoute.params.map(params => [params['userid'], params['fdate'], params['tdate'], params['status']]).subscribe(async ([userid, fdate, tdate, status]) => {
            if (userid >= 0) {
                this.searchModel.userId = Number.parseInt(userid);
                this.searchModel.fromDate = new Date(fdate);
                this.searchModel.toDate = new Date(tdate);
                this.searchModel.status = Number.parseInt(status);
                this.disabled = true;
            }

            await this.getData();
        });
        this.loadTableColumnConfig();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'id',
                header: 'Mã',
                visible: true,
                align: 'center',
                width: '3%',
                sort: true,
            },
            {
                field: 'idClient',
                header: 'Doanh nghiệp',
                visible: false,
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'userName',
                header: 'userName',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'name',
                header: 'Họ và tên',
                visible: true,
                width: '5%',
                sort: true,
            },
            {
                field: 'phone',
                header: 'SĐT',
                visible: true,
                align: 'center',
                width: '5%',
                sort: true,
            },
            {
                field: 'createdDate',
                header: 'Ngày giao dịch',
                visible: true,
                width: '100px',
                dataType: 'date',
                align: 'center',
                sort: false,
            },
            {
                field: 'dealTypeName',
                header: 'Loại giao dịch',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'note',
                header: 'Nội dung',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'type',
                header: 'Nhóm',
                visible: true,
                align: 'center',
                width: '100px',
                sort: true
            },
            {
                field: 'objectId',
                header: 'Mã tham chiếu',
                visible: true,
                width: '100px',
                align: 'center',
                sort: true
            },
            {
                field: 'balanceBefore',
                header: 'Số dư đầu',
                dataType: 'number',
                visible: true,
                width: '100px',
                align: 'right',
                sort: true
            },
            {
                field: 'deal',
                header: 'Số xu cộng',
                dataType: 'number',
                visible: true,
                width: '100px',
                align: 'right',
                sort: true
            },
            {
                field: 'negativeDeal',
                header: 'Số xu trừ',
                dataType: 'number',
                visible: true,
                width: '100px',
                align: 'right',
                sort: true
            },
            {
                field: 'balance',
                header: 'Số dư cuối',
                dataType: 'number',
                visible: true,
                width: '100px',
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
        if (this.searchModel.fromDate) { this.searchModel.fromDate = new Date(this.searchModel.fromDate); }
        if (this.searchModel.toDate) { this.searchModel.toDate = new Date(this.searchModel.toDate); }
        this.dataSource = [];
        await this._StatementsService.Gets(
            this.searchModel.key,
            this.searchModel.dealtype,
            this.user == null ? this.searchModel.userId : this.user.userId,
            this.searchModel.status,
            this.searchModel.fromDate,
            this.searchModel.toDate,
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
    async autoComplete(event) {
        const query = event.query;
        await this._UserService.gets(query, -1, 0, 50).then(rs => {
            if (rs.status) {
                this.users = rs.data;
                this.total = rs.totalRecord;
            }
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
