import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { RutDiemCaNhanEditComponent } from './point-withdraw-edit/point-withdraw-edit.component';
import { PointsService } from '../../services/points.service';
import { PointStatus } from '../../common/constant';
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PointDepositPersonalEditComponent } from './point-deposit-edit/point-deposit-edit.component';

@Component({
    selector: 'app-point-personal',
    templateUrl: './point-personal.component.html',
    styleUrls: ['./point-personal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PointPersonalComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        dealType: -1,
        status: -1
    };
    colFilter: any = {};
    request: any = {};
    trangThai_options: any[] = [];
    dealType_options: any[] = [];
    disabled = false;
    PointStatus = PointStatus;
    @ViewChild(RutDiemCaNhanEditComponent) _rutDiem: RutDiemCaNhanEditComponent;
    @ViewChild(PointDepositPersonalEditComponent) _napDiem: PointDepositPersonalEditComponent;

    vi: any;
    fromDate: Date;
    toDate: Date;
    exportName = 'Diem-thuong-ca-nhan';
    constructor(
        private _configurationService: ConfigurationService,
        protected _injector: Injector,
        private activatedRoute: ActivatedRoute,
        private _PointsService: PointsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.dealType_options = [
            { label: '-- Chọn loại --', value: -1 },
            { label: 'Nạp xu', value: 3 },
            { label: 'Rút xu', value: 4 }
        ];
        this.trangThai_options = [
            { label: '-- Trạng thái --', value: -1 },
            { label: 'Chưa xử lý', value: 0 },
            { label: 'Đang xử lý', value: 1 },
            { label: 'Thành công', value: 2 },
            { label: 'Hủy', value: 3 },
            { label: 'Lỗi', value: 4 }
        ];
        this.cols = [
            {
                field: 'code',
                header: 'Mã giao dịch',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                dataType: 'date',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'dealTypeName',
                header: 'Loại giao dịch',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'payment',
                header: 'Phương thức',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'negativeDeal',
                header: 'Số điểm rút',
                align: 'right',
                dataType: 'number',
                width: '10%',
                visible: true,
                sort: true,
            },
            {
                field: 'deal',
                header: 'Số điểm nạp',
                align: 'right',
                dataType: 'number',
                width: '10%',
                visible: true,
                sort: true,
            },
            {
                field: 'tax',
                header: 'Thuế TNCN',
                align: 'right',
                dataType: 'number',
                width: '5%',
                visible: true,
                sort: true,
            },
            {
                field: 'fee',
                header: 'Phí giao dịch',
                align: 'right',
                dataType: 'number',
                width: '5%',
                visible: true,
                sort: true,
            },
            // {
            //     field: 'note',
            //     header: 'Ghi chú',
            //     visible: true,
            //     width: '20%',
            //     align: 'left',
            //     sort: true
            // },
            {
                field: 'updatedDate',
                header: 'Ngày cập nhật',
                visible: true,
                dataType: 'date',
                width: '10%',
                align: 'center',
                sort: true
            },
            {
                field: 'status',
                header: 'Trạng thái',
                visible: true,
                width: '10%',
                align: 'center',
                sort: true
            },
            {
                field: 'note',
                header: 'Ghi chú',
                visible: true,
                width: '15%',
                sort: true
            }
        ];

        this.activatedRoute.queryParams.subscribe(async params => {
            this.request.transaction_info = params['transaction_info'];
            this.request.order_code = params['order_code'];
            this.request.price = params['price'];
            this.request.payment_id = params['payment_id'];
            this.request.payment_type = params['payment_type'];
            this.request.error_text = params['error_text'];
            this.request.secure_code = params['secure_code'];
            this.request.token_nl = params['token_nl'];
            // this.person = this.peopleService.get(id);
            if (this.request.order_code) {
                this._PointsService.VerifyPaymentUrl(
                    this.request.transaction_info,
                    this.request.order_code,
                    this.request.price,
                    this.request.payment_id,
                    this.request.payment_type,
                    this.request.error_text,
                    this.request.secure_code
                ).then(async rs => {
                    if (rs.status) {
                        this._notifierService.showSuccess('Nạp xu thành công!');
                        await this.getData();
                        this._router.navigate(['/point-personal']);
                    } else {
                        this._notifierService.showError('', rs.message);
                    }
                });
            } else {
                await this.getData();
            }
        });

        // const itemId = +this.activatedRoute.snapshot.queryParams['order_code'];

        // this.activatedRoute.queryParams.map(params => [params['order_code'], params['price'], params['payment_id'], params['payment_type']])
        //     .subscribe(async ([userid, fdate, tdate, status]) => {
        //         if (userid >= 0) {
        //             this.searchModel.userId = Number.parseInt(userid);
        //             this.searchModel.fromDate = new Date(fdate);
        //             this.searchModel.toDate = new Date(tdate);
        //             this.searchModel.status = Number.parseInt(status);
        //             this.disabled = true;
        //         }
        //         await this.getData();
        //     });
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        if (this.fromDate) { this.fromDate = new Date(this.fromDate); }
        if (this.toDate) { this.toDate = new Date(this.toDate); }
        await this._PointsService.GetsCurrentUser(this.searchModel.key, this.searchModel.dealType, this.searchModel.status,
            this.fromDate,
            this.toDate, (this.page - 1) * this.limit, this.limit, this.sortField).then(rs => {
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

    onRut(id: any) {
        this._rutDiem.showPopup(id);
    }
    onNap(id: any) {
        this._napDiem.showPopup(id);
    }

    onCancel(id: number) {
        this._PointsService.CancelWithdraw(id).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Hủy thành công');
                this.getData();
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }
    onCheckPayment(id: number) {
        this._PointsService.CheckPayment(id).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Giao dịch thành công');
                this.getData();
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }


    onCloseForm() {
        this.getData();
    }

}
