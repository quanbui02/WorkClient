import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { OrdersService } from '../../../services/orders.service';
import { StatusService } from '../../../services/status.service';
import { ActionsService } from '../../../services/actions.service';
import { AhamoveService } from '../../../services/ahamove.service';
import { MapComponent } from '../map/map.component'

@Component({
    selector: 'app-orders-multi-ship',
    templateUrl: './orders-multi-ship.component.html',
    styleUrls: ['./orders-multi-ship.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrdersMultiShipComponent extends SecondPageEditBase
    implements OnInit {
    item: any = {};
    cols = [];
    dataSource = [];
    modelEdit: any = {
        ids: [],
        idLogistics: '',
        voucher: '',
    };
    lstOrdersEstimateFee: any;
    ordersShip: any;
    isLoading = false;
    isShiped = false;
    listLogistics: any[] = [];
    totalMoneyProduct = 0;
    totalMoneyShip = 0;
    totalOrders = 0;
    totalDiscount = 0;

    @ViewChild(MapComponent) _mapComponnent: MapComponent;

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
                field: 'deliveryDate',
                header: 'Thời gian nhận hàng',
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

    async loadListService() {
        var provinceName = 'HAN';
        if (this.dataSource && this.dataSource.length > 0) {
            var itemFirst = this.dataSource[0].idProvince;
            if (itemFirst === 79) {
                provinceName = 'SGN';
            }
            if (itemFirst === 48) {
                provinceName = 'DAD';
            }
            if (itemFirst === 75) {
                provinceName = 'DNI';
            }
        }
        await this._AhamoveService.GetListServices(provinceName).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.listLogistics.push({ label: item.name, value: item._id, desc: item.fee_description_en_us });
                });
            }
        });
    }

    async ShowDeliveryDate(createdDate: string, deliveryDate: string) {
        var item = { createdDate: createdDate, deliveryDate: deliveryDate };
        await this._OrdersService.ShowDeliveryDate(item).then(rs => {
            if (rs.status) {
                return rs.message;
            }
        });
    }

    async onRemoveList(item) {
        this.dataSource.splice(this.dataSource.indexOf(item), 1);
        await this.showPopup(this.dataSource);
    }

    getNoteService(serviceId) {
        return this.listLogistics.filter(d => d.value === serviceId)[0].desc
    }

    async showPopup(item: any) {
        this.formGroup.reset();
        this.isLoading = true;
        this.isShow = true;
        this.isShiped = false;
        this.modelEdit.ids = [];
        this.ordersShip = null;
        this.modelEdit.idLogistics = '';
        this.dataSource = item;
        this.lstOrdersEstimateFee = null;
        await this.loadListService();
        // await this.dataSource.forEach(async obj => {
        //     obj.showDeliveryDate = await this.ShowDeliveryDate(obj.createdDate, obj.deliveryDate);
        // });
        this.dataSource.forEach(obj => {
            this.modelEdit.ids.push(obj.id);
        });
        this.isLoading = false;
        this.totalMoneyProduct = item.filter(item => item.total)
            .reduce((sum, current) => sum + current.total, 0);
        this.totalMoneyShip = item.filter(item => item.ship)
            .reduce((sum, current) => sum + current.ship, 0);
        this.totalOrders = item.filter(item => item.totalBill)
            .reduce((sum, current) => sum + current.totalBill, 0);
        this.totalDiscount = item.filter(item => item.discount)
            .reduce((sum, current) => sum + current.discount, 0);
        await this._OrdersService.OrdersEstimateFee(this.modelEdit.ids, this.modelEdit.idLogistics, this.modelEdit.voucher).then(async rs => {
            if (rs.status) {
                this.lstOrdersEstimateFee = rs.data;
                this._mapComponnent.showMap(rs.data);
            } else {
                this._notifierService.showError(rs.message);
            }
        }).finally(async () => {
        });
    }

    async onEstimate() {
        this.isLoading = true;
        if (!this.modelEdit.ids || this.modelEdit.ids.length <= 0) {
            this._notifierService.showError("Xin hãy thao tác lại.");
            return false;
        }
        this._OrdersService.OrdersEstimateFee(this.modelEdit.ids, this.modelEdit.idLogistics, this.modelEdit.voucher).then(rs => {
            if (rs.status) {
                this.lstOrdersEstimateFee = rs.data;
                this._mapComponnent.showMap(rs.data);
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.GetData();
        this.isLoading = false;
    }

    closePopupMethod(data) {
        this.isShow = false;
        this.closePopup.next(data);
        this._mapComponnent.closeMap();
    }

    getTotalCOD() {
        var cod = 0;
        if (this.lstOrdersEstimateFee.path) {
            cod = this.lstOrdersEstimateFee.path.filter(item => item.cod)
                .reduce((cod, current) => cod + current.cod, 0);
        }
        return cod;
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    async GetData() {
        return;
    }

    async onSave() {
        await this.Actions();
    }

    async Actions() {
        this.isLoading = true;
        if (!this.modelEdit.ids) {
            this._notifierService.showError("Xin hãy thao tác lại.");
            return false;
        }
        await this._notifierService.showConfirm(`Bạn muốn đặt ship?`, 'Xác nhận').then(rs => {
            this._OrdersService.OrdersShip(this.modelEdit.ids, this.modelEdit.idLogistics, this.modelEdit.voucher, this.modelEdit.note).then(rs => {
                if (rs.status) {
                    this.ordersShip = rs.data;
                    this.isShiped = true;
                    this.closePopup.emit(this.modelEdit.ids);
                    this._notifierService.showSuccess(rs.message);
                } else {
                    this._notifierService.showError(rs.message);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });

        this.isLoading = false;
    }
}

