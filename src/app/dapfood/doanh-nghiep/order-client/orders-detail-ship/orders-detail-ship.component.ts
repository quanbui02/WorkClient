import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { User } from '../../../../lib-shared/models/user';
import { UserService } from '../../../../lib-shared/services/user.service';
import { OrdersService } from '../../../services/orders.service';
import { StatusService } from '../../../services/status.service';
import { ActionsService } from '../../../services/actions.service';
import { AhamoveService } from '../../../services/ahamove.service';

@Component({
    selector: 'app-orders-detail-ship',
    templateUrl: './orders-detail-ship.component.html',
    styleUrls: ['./orders-detail-ship.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrdersDetailShipComponent extends SecondPageEditBase
    implements OnInit {
    item: any = {};
    cols = [];
    dataSource = [];
    ordersShip: any;
    isLoading = false;
    isShiped = true;
    listLogistics: any[] = [];
    totalMoneyProduct = 0;
    totalMoneyShip = 0;
    totalOrders = 0;
    totalDiscount = 0;
    shipCode = '';
    modelEdit: any = {
        noteCancel: ''
    };
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        protected _translateService: TranslateService,
        private _OrdersService: OrdersService,
        public _StatusService: StatusService,
        public _ActionsService: ActionsService,
        private _AhamoveService: AhamoveService,
    ) {
        super(null, _injector);
        this.formGroup = new FormGroup({
            idLogistics: new FormControl(''),
            voucher: new FormControl(''),
            note: new FormControl(''),
            noteCancel: new FormControl(''),
        });
    }

    async ngOnInit() {
        this.cols = [
            {
                field: 'code',
                header: 'Mã đơn',
                visible: true,
                align: 'center',
                //width: '2%',
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                dataType: 'date',
                align: 'center',
                //width: '5%',
            },
            {
                field: 'name',
                header: 'Họ và tên',
                visible: true,
                width: '25%',
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
                visible: true,
                align: 'center',
                //width: '5%',
            },
            {
                field: 'isPrepay',
                header: 'TT thanh toán',
                visible: true,
                align: 'center',
                //width: '2%',
            },
            {
                field: 'total',
                header: 'Tiền hàng',
                dataType: 'number',
                visible: true,
                //width: '5%',
                align: 'right',
            },
            {
                field: 'ship',
                header: 'Vận chuyển',
                dataType: 'number',
                visible: true,
                //width: '5%',
                align: 'right',
            },
            {
                field: 'discount',
                header: 'Khuyến mãi',
                dataType: 'number',
                visible: true,
                //width: '5%',
                align: 'right',
            },
            {
                field: 'totalBill',
                header: 'Tổng tiền',
                dataType: 'number',
                visible: true,
                //width: '5%',
                align: 'right',
            },
        ];
    }

    getNameShipStatus(status) {
        switch (status) {
            case 'IDLE': {
                return 'Nhận đơn';
            }
            case 'ASSIGNING': {
                return 'Đang tìm tài xế';
            }
            case 'ACCEPTED': {
                return 'Tìm được tài xế';
            }
            case 'IN PROCESS': {
                return 'Đã lấy, đang giao';
            }
            case 'COMPLETED': {
                return 'Hoàn thành';
            }
            case 'CANCELLED': {
                return 'Hủy đơn';
            }
            case 'FAILED': {
                return 'Không thể giao';
            }
        }
    }

    async onRemoveList(item) {
        this.dataSource.splice(this.dataSource.indexOf(item), 1);
        await this.showPopup(this.dataSource);
    }

    async CancelShip(shipcode) {
        await this._AhamoveService.CancelShipOrder(shipcode, this.modelEdit.noteCancel).then(async rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    getTotalCOD() {
        var cod = 0;
        if (this.ordersShip.path) {
            cod = this.ordersShip.path.filter(item => item.cod)
                .reduce((cod, current) => cod + current.cod, 0);
        }
        return cod;
    }

    async showPopup(item: any) {
        this.shipCode = item;
        this.isLoading = true;
        this.isShow = true;
        this.ordersShip = null;

        await this._OrdersService.GetOrderByShipCode(item).then(async rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.totalMoneyProduct = this.dataSource.filter(item => item.total)
                    .reduce((sum, current) => sum + current.total, 0);
                this.totalMoneyShip = this.dataSource.filter(item => item.ship)
                    .reduce((sum, current) => sum + current.ship, 0);
                this.totalOrders = this.dataSource.filter(item => item.totalBill)
                    .reduce((sum, current) => sum + current.totalBill, 0);
                this.totalDiscount = this.dataSource.filter(item => item.discount)
                    .reduce((sum, current) => sum + current.discount, 0);
            } else {
                this._notifierService.showError(rs.message);
            }
        });

        await this._OrdersService.GetDetailOrderAhamove(item).then(async rs => {
            if (rs.status) {
                this.ordersShip = rs.data;
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.isLoading = false;
    }

    async onEstimate() {
        this.isLoading = true;
        this.isLoading = false;
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    async GetData() {
    }

    async onSave() {
        await this.Actions();
    }

    async Actions() {
        this.isLoading = true;
        this.isLoading = false;
    }


}

