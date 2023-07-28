import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { PointStatus } from '../../common/constant';
import { PointsService } from '../../services/points.service';
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';
import { PointErrorEditComponent } from './point-error-edit/point-error-edit.component';
import { PointDepositAdminEditComponent } from './point-deposit-admin-edit/point-deposit-admin-edit.component';

@Component({
    selector: 'app-point-admin',
    templateUrl: './point-admin.component.html',
    styleUrls: ['./point-admin.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PointAdminComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        dealType: -1,
        payment: -1,
        user: [],
        userId: -1,
        status: -1
    };
    colFilter: any = {};
    trangThai_options: any[] = [];
    payment_options: any[] = [];
    disabled = false;
    users: any;
    itemDetail: any = {};
    PointStatus = PointStatus;
    @ViewChild(PointErrorEditComponent) _errorPointAdminEditComponent: PointErrorEditComponent;
    @ViewChild(PointDepositAdminEditComponent) _NapDiemAdminEditComponent: PointDepositAdminEditComponent;

    vi: any;
    fromDate: Date;
    toDate: Date;
    dealType_options: any[] = [];
    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _PointsService: PointsService,
        private _UserService: UserService

    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.payment_options = [
            { label: '-- Chọn phương thức --', value: -1 },
            { label: 'Ngân lượng', value: 1 },
            { label: 'Thủ công', value: 2 }
        ];
        this.dealType_options = [
            { label: '-- Chọn loại --', value: -1 },
            { label: 'Nạp điểm', value: 3 },
            { label: 'Rút điểm', value: 4 }
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
                field: 'name',
                header: 'Tài khoản',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'idClient',
                header: 'Doanh nghiệp',
                visible: false,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                dataType: 'date',
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
                field: 'code',
                header: 'Mã giao dịch',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
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
                dataType: 'number',
                align: 'right',
                width: '10%',
                visible: true,
                sort: true,
            },
            {
                field: 'deal',
                header: 'Số điểm nạp',
                dataType: 'number',
                align: 'right',
                width: '10%',
                visible: true,
                sort: true,
            },
            {
                field: 'tax',
                header: 'Thuế',
                dataType: 'number',
                align: 'right',
                width: '10%',
                visible: true,
                sort: true,
            },
            {
                field: 'fee',
                header: 'Phí',
                dataType: 'number',
                align: 'right',
                width: '10%',
                visible: true,
                sort: true,
            },
            {
                field: 'updatedDate',
                header: 'Ngày cập nhật',
                dataType: 'date',
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
            },
            {
                field: 'status',
                header: 'Trạng thái',
                visible: true,
                width: '10%',
                align: 'center',
                sort: true
            }
        ];
        await this.getData();
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }
    async getData() {
        this.isLoading = true;
        if (this.fromDate) { this.fromDate = new Date(this.fromDate); }
        if (this.toDate) { this.toDate = new Date(this.toDate); }
        this.dataSource = [];
        await this._PointsService.Gets(
            this.searchModel.key,
            this.searchModel.payment,
            this.searchModel.dealType,
            this.searchModel.userId,
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

    onEdit(id: any) {
        this._NapDiemAdminEditComponent.showPopup(id);
    }

    onCongTien(id: any) {
    }

    onRutTien(id: any) {
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

    onSelect(event) {
        // this.dataSource.push(event);
        this.searchModel.userId = event.userId;
    }

    onProcess(id: number) {
        this.isLoading = true;
        this.itemDetail.id = id;
        this._PointsService.Process(this.itemDetail).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Thực hiện thành công');
                this.getData();
                this.isLoading = false;
            } else {
                this._notifierService.showError(rs.message);
                this.isLoading = false;
            }
        });
    }

    onProcessKT(id: number, status: number, note: string) {
        this.isLoading = true;
        this.itemDetail.id = id;
        this.itemDetail.status = status;
        this.itemDetail.note = note;
        if (status === PointStatus.KTDuyetThatBai) {
            this.isLoading = false;
            this._errorPointAdminEditComponent.showPopup(this.itemDetail);
        } else {
            this._PointsService.ProcessKT(this.itemDetail).then(rs => {
                if (rs.status) {
                    this._notifierService.showSuccess('Thực hiện thành công');
                    this.getData();
                    this.isLoading = false;
                } else {
                    this._notifierService.showError(rs.message);
                    this.isLoading = false;
                }
            });
        }
    }

    onProcessAdmin(id: number, status: number, note: string) {
        this.isLoading = true;
        this.itemDetail.id = id;
        this.itemDetail.status = status;
        this.itemDetail.note = note;
        if (status === PointStatus.AdminDuyetThatBai) {
            this.isLoading = false;
            this._errorPointAdminEditComponent.showPopup(this.itemDetail);
        } else {
            this._PointsService.ProcessAdmin(this.itemDetail).then(rs => {
                if (rs.status) {
                    this._notifierService.showSuccess('Thực hiện thành công');
                    this.getData();
                    this.isLoading = false;
                } else {
                    this._notifierService.showError(rs.message);
                    this.isLoading = false;
                }
            });
        }
    }

    onProcessFinish(id: number, status: number, note: string) {
        this.isLoading = true;
        this.itemDetail.id = id;
        this.itemDetail.status = status;
        this.itemDetail.note = note;
        if (status === PointStatus.Loi) {
            this._errorPointAdminEditComponent.showPopup(this.itemDetail);
        } else {
            this._PointsService.ProcessFinish(this.itemDetail).then(rs => {
                if (rs.status) {
                    this._notifierService.showSuccess('Thực hiện thành công');
                    this.getData();
                    this.isLoading = false;
                } else {
                    this._notifierService.showError(rs.message);
                    this.isLoading = false;
                }
            });
        }
    }

    onCloseForm() {
        this.getData();
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
}
