import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { ReportService } from '../report.service';

@Component({
    selector: 'app-ReportClientBaoCaoChiTietDonHang',
    templateUrl: './ReportClientBaoCaoChiTietDonHang.component.html',
    styleUrls: ['./ReportClientBaoCaoChiTietDonHang.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReportClientBaoCaoChiTietDonHangComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        ctv: '',
        orderType: -1,
        idProduct: -1,
        status: -1,
        fromDate: new Date(),
        toDate: new Date(),
    };
    status_options = [];
    orderType_options = [];
    colFilter: any = {};
    disabled = false;
    openSearchAdv = true;
    vi: any;

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _ReportService: ReportService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.searchModel.fromDate.setDate(this.searchModel.toDate.getDate() - 60);

        this.cols = [
            {
                field: 'num',
                header: 'STT',
                visible: true,
                align: 'center',
                width: '40px',
                sort: true,
            },
            {
                field: 'userId',
                header: 'Mã CTV',
                visible: true,
                width: '150px',
                align: 'left',
                sort: true,
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                align: 'left',
                sort: true,
            },
            {
                field: 'completedDate',
                header: 'Ngày thành công',
                visible: true,
                align: 'left',
                sort: true,
            },
            {
                field: 'name',
                header: 'Tên khách hàng',
                visible: true,
                align: 'left',
                sort: true,
                width: '190px',
            },
            {
                field: 'phone',
                header: 'SĐT',
                visible: true,
                align: 'left',
                sort: true,
            },
            {
                field: 'isPrepay',
                header: 'Trạng thái thanh toán',
                visible: true,
                align: 'center',
                sort: true,
            },
            {
                field: 'productName',
                header: 'Tên sản phẩm',
                visible: true,
                align: 'left',
                width: '10%',
                sort: true,
            },
            {
                field: 'price',
                header: 'Giá',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'quantity',
                header: 'Số lượng',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'total',
                header: 'Tiền hàng',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'ship',
                header: 'Phí vận chuyển',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'discount',
                header: 'Giảm giá',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'totalBill',
                header: 'Tổng tiền đơn hàng',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'productReward',
                header: 'Thưởng CTV/Tiền hàng',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'prepayReward',
                header: 'Thưởng thanh toán trước',
                visible: true,
                align: 'right',
                sort: true,
            },
            {
                field: 'totalReward',
                header: 'Tổng thưởng CTV',
                visible: true,
                align: 'right',
                sort: true,
            }
        ];
        await this.getData();
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._ReportService.Report_Client_BaoCaoChiTietDonHang(
            this.searchModel.fromDate,
            this.searchModel.toDate
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.dataTotal = [rs.dataTotal];
                this.total = rs.totalRecord;
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.isLoading = false;
    }
    getAvatar(id) {
        if (id) {
            return this.getImageAvatar(id);
        }
        else {
            return `/assets/images/avatar.jpg`;
        }
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
}
