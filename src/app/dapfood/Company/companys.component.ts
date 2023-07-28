import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { User } from '../../lib-shared/models/user';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { CompanysService } from '../services/companys.service';


@Component({
    selector: 'app-companys',
    templateUrl: './companys.component.html',
    styleUrls: ['./companys.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CompanysComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        idProduct: -1,
        type: -1,
        status: -1,
    };
    status_options = [];
    actions_options = [];
    listOrdersPrint: any[] = [];
    orderType_options = [];
    colFilter: any = {};
    disabled = false;
    ref: DynamicDialogRef;
    crrUser: User;
    vi: any;
    timeAgo: any;

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        public dialogService: DialogService,
        private activatedRoute: ActivatedRoute,
        private _companysService: CompanysService,
    ) {
        super(null, _injector);
    }


    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;

        this.cols = [
            {
                field: 'taxCode',
                header: 'Mã số thuế',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'legalName',
                header: 'Người đại diện',
                visible: true,
                width: '10%',
            },
            {
                field: 'fullName',
                header: 'Tên Đơn vị',
                visible: true,
            },
            {
                field: 'adressLine',
                header: 'Địa chỉ',
                visible: true,
            },
            {
                field: 'email',
                header: 'Email',
                visible: false,
                width: '10%',
            },
            {
                field: 'phoneNumber',
                header: 'Số điện thoại',
                visible: true,
                width: '10%',
            },
            {
                field: 'faxNumber',
                header: 'Số fax',
                visible: true,
                width: '10%',
            },
            {
                field: 'bankName',
                header: 'Ngân hàng',
                visible: false,
                width: '10%',
            },
            {
                field: 'bankAccount',
                header: 'Tài khoản',
                visible: false,
                width: '10%',
            },
            {
                field: 'website',
                header: 'Website',
                visible: false,
                width: '10%',
            }
        ];

        await this.activatedRoute.params.map(params => [params['key']]).subscribe(async ([key]) => {
            if (key) {
                this.searchModel.key = key;
            }
        });

        await this.getData();
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }

    onAdd() {
        // this._orderAdd.showPopup(0);
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._companysService.GetCompanys(
            this.searchModel.key,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            (this.isAsc ? 1 : 0),
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
    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    fixTableScrollProblem() {
        this.dataSource = [...this.dataSource];
    }

    async onCloseForm() {
        await this.getData();
    }
}
