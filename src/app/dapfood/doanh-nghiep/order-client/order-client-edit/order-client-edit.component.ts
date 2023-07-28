import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/api';
import { OrdersService } from '../../../services/orders.service';
import { ProvincesService } from '../../../services/provinces.service';
import { DistrictsService } from '../../../services/districts.service';
import { WardsService } from '../../../services/wards.service';
import { ProductRegService } from '../../../services/productregs.service';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { PromotionsService } from '../../../services/promotions.service';
import { UserService } from '../../../../lib-shared/services/user.service';
import { User } from '../../../../lib-shared/models/user';
import { ClientsService } from '../../../services/clients.service';
import { EnumOrderStatus } from '../../../common/constant';
import { StatusService } from '../../../services/status.service';
import { ShopsService } from '../../../services/shops.service';
import { ConfigurationService } from '../../../../lib-shared/services/configuration.service';
import * as moment from 'moment';
import { ActionsService } from '../../../services/actions.service';
import { OrderActionsService } from '../../../services/orderactions.service';
import { OrderStatusService } from '../../../services/orderstatus.service';
import { EventEmitterService } from '../../../../services/eventemitter.service';
import { OmiCallLogsService } from '../../../services/OmiCallLogs.service';
declare var omiSDK: any;
@Component({
    selector: 'app-order-client-edit',
    templateUrl: './order-client-edit.component.html',
    styleUrls: ['./order-client-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrderClientEditComponent extends SecondPageEditBase
    implements OnInit {

    isView = false;
    total = 0;
    page = 1;
    limit = 100;
    limitAll = 10000;
    cols = [];
    selectedItems = [];
    dataSource = [];
    // dataCOD = [];
    isLoading = false;
    showdeliveryDate = '';
    deliveryDate: any;
    results: any;
    key: string;
    khachCu: string;
    listKhachCu: any;
    selectedKhachCu: any;
    ref: DynamicDialogRef;
    enumOrderStatus = EnumOrderStatus;
    lstStatus = [];

    province_options: any[]; // = [{ label: '-- Tỉnh/TP --', value: 0 }];
    distric_options: any[]; // = [{ label: '-- Quận huyện--', value: 0 }];
    ward_options: any[]; // = [{ label: '-- Xã phường --', value: 0 }];
    shopward_options: any[];
    modelEdit: any = {
        // isVerified: 1,
        idProvince: 0,
        idDistrict: 0,
        idWard: 0,
        total: 0,
        discount: 0,
        totalBill: 0,
        productReward: 0,
        promotionReward: 0,
        prepayReward: 0,
        totalReward: 0,
        totalGift: 0,
        ship: 0,
        deliveryDate: '',
        idShop: -1,
        idShopDistrict: -1,
        idShopWard: -1,
        idStatus: 0,
        notePopup: '',
        idAction: 0,
        namePopup: ''
    };

    modelUpdateAction: any = {
        idStatus: 0,
        notePopup: '',
        idAction: 0,
        namePopup: ''
    };
    isVerified = 1;
    paymentChannel = 0;
    crrUser: User;
    crrShop = -1;

    listImage: any[] = [];
    listLogistics: any[] = [];
    dataGetLogistics: any[];   // Danh sách đơn vị giao hàng
    listTranport: any[] = [];
    listShops: any[] = [];
    listShops_option = [];
    modelInfo: any = {
        idPhuongThucGiaoHang: 0
    };
    status_options: any = [];
    actions_options: any = [];
    list_actions: any = [];
    list_status: any = [];
    omicallLogIds: any = "";
    omicallLogs: any = [];
    omicallOrderLogs: any = [];
    detailCall: any = [];
    hideme = [];
    Index: any;

    constructor(
        protected _injector: Injector,
        private _OrdersService: OrdersService,
        private _ProvincesService: ProvincesService,
        private _DistrictsService: DistrictsService,
        private _ProductRegService: ProductRegService,
        private _WardsService: WardsService,
        public dialogService: DialogService,
        private _configurationService: ConfigurationService,
        public _PromotionsService: PromotionsService,
        private _UserService: UserService,
        private _ClientService: ClientsService,
        private _StatusService: StatusService,
        public _ActionsService: ActionsService,
        private _ShopsService: ShopsService,
        public _OrderActionsService: OrderActionsService,
        public _OrderStatusService: OrderStatusService,
        private _EventEmitterService: EventEmitterService,
        public _OmicallLogsService: OmiCallLogsService,
    ) {
        super(null, _injector);

        this.formGroup = new FormGroup({
            name: new FormControl('', Validators.compose([Validators.required])),
            idProvince: new FormControl('', Validators.compose([Validators.required])),
            idDistrict: new FormControl('', Validators.compose([Validators.required])),
            idWard: new FormControl('', Validators.compose([Validators.required])),
            address: new FormControl('', Validators.compose([Validators.required])),
            note: new FormControl(''),
            isVerified: new FormControl(''),
            paymentChannel: new FormControl(''),
            deliveryDate: new FormControl(''),
            myRadio: new FormControl(''),
            phone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^((84|0[3|5|7|8|9])+([0-9]{8})\b)$/)])),
            logisticId: new FormControl(''),
            tranportId: new FormControl(''),
            idShop: new FormControl(''),
            idShopDistrict: new FormControl(''),
            idShopWard: new FormControl(''),
            idAction: new FormControl(''),
            idStatus: new FormControl(''),
            namePopup: new FormControl(''),
            notePopup: new FormControl('')
        });
    }

    async ngOnInit() {
        this.crrUser = await this._UserService.getCurrentUser();
        //this.vi = this._configurationService.calendarVietnamese;
        this.cols = [
            {
                field: 'image',
                header: 'Ảnh',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'code',
                header: 'Mã',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                width: '40%',
                sort: true
            },
            {
                field: 'price',
                header: 'Đơn giá',
                visible: true,
                width: '10%',
                align: 'right',
                sort: true
            },
            {
                field: 'quantity',
                header: 'Số lượng',
                visible: true,
                width: '10%',
                align: 'center',
                sort: true
            },
            {
                field: 'totalBill',
                header: 'Thành tiền',
                visible: true,
                width: '10%',
                align: 'right',
                sort: true
            },
            {
                field: 'reward',
                header: 'Hoa hồng',
                visible: true,
                width: '10%',
                align: 'right',
                sort: true
            }
        ];

        await this.GetInfo();
        this._EventEmitterService.omicall.subscribe(item => this.ShowLogsOmicall(item));
    }

    ShowLogsOmicall(item: any) {
        console.log("du lieu log IDlog omicall = " + JSON.stringify(item));
        if (Object.keys(item).length != 0) {
            var modelOmicallUpdate = {
                Id: item.id,
                IdOrder: this.modelEdit.id,
                UserId: this.modelEdit.userId,
            }
            this._OmicallLogsService.UpdateOmicallLog(modelOmicallUpdate);
            if (this.omicallLogIds) this.omicallLogIds += "," + item.id;
            else this.omicallLogIds = item.id;
            if (JSON.stringify(this.detailCall) == JSON.stringify([])) this.detailCall = [item];
            else this.detailCall.push(item);
        }
    }

    async loadStatus() {
        this.status_options = [];
        this.isLoading = true;
        await this._StatusService.GetListByRoles().then(rs => {
            if (rs.status) {
                let obj = rs.data.find(s => s.id == this.modelEdit.idStatus);
                if (obj && obj.actions && obj.actions.indexOf(";") != -1) {
                    var lstActions = obj.actions.split(';').map(Number);
                    let lstStatusAccept = rs.data.filter(s => lstActions.includes(s.id));
                    lstStatusAccept.forEach(item => {
                        this.status_options.push({ label: item.name, value: item.id });
                    });
                }
            }
        });
        this.isLoading = false;
    }

    async loadActions() {
        this.actions_options = [];
        this.isLoading = true;
        await this._ActionsService.GetListByRoles().then(rs => {
            if (rs.status) {
                let obj = rs.data.find(s => s.id == (this.modelEdit.idAction ? this.modelEdit.idAction : 1));
                if (obj && obj.actions1 && obj.actions1.indexOf(";") != -1) {
                    var lstActions = obj.actions1.split(';').map(Number);
                    let lstActionAccept = rs.data.filter(s => lstActions.includes(s.id));
                    lstActionAccept.forEach(item => {
                        this.actions_options.push({ label: item.name, value: item.id });
                    });
                }
            }
        });
        this.isLoading = false;
    }

    async loadHistoryAction() {
        this.isLoading = true;
        await this._OrderActionsService.GetByIdOrder(this.modelEdit.id).then(rs => {
            if (rs.status) {
                this.list_actions = rs.data;
            }
        });
        this.isLoading = false;
    }

    async loadHistoryStatus() {
        this.isLoading = true;
        await this._OrderStatusService.GetByIdOrder(this.modelEdit.id).then(rs => {
            if (rs.status) {
                this.list_status = rs.data;
            }
        });
        this.isLoading = false;
    }

    async loadOmicallOrderLogs() {
        this.isLoading = true;
        await this._OmicallLogsService.GetLogByOrderId(this.modelEdit.id).then(rs => {
            if (rs.status) {
                this.omicallOrderLogs = rs.data;
            }
        });
        this.isLoading = false;
    }

    async onLoadStatus() {
        this.lstStatus = [];
        if (this.lstStatus) {
            this._StatusService.GetListByRoles().then(rs => {
                if (rs.status) {
                    this.lstStatus = rs.data;
                }
            });
        }
    }

    async onLoadProvinces() {
        await this._ProvincesService.GetShort().then(rs => {
            if (rs.status) {
                this.province_options = rs.data;
            }
        });
    }

    async onLoadDistricts() {
        await this._DistrictsService.GetShort(this.modelEdit.idProvince).then(rs => {
            if (rs.status) {
                this.distric_options = rs.data;
            }
        });
    }

    async onLoadWards() {
        await this._WardsService.GetShort(this.modelEdit.idDistrict).then(rs => {
            if (rs.status) {
                this.ward_options = rs.data;
            }
        });
    }

    async GetInfo() {
        this.isLoading = true;
        this.GetLogistics();
        await this._ClientService.getDetail(this.crrUser.idClient).then(async rs => {
            if (rs.status) {
                this.modelInfo = rs.data;
            }
            this.isLoading = false;
        }, error => {
            this._notifierService.showHttpUnknowError();
        });
    }

    async GetLogistics() {
        this.listLogistics = [{ label: 'Ahamove', value: 1 }];
    }

    async GetShopChangeMap() {

    }

    async GetShops() {
        this.listShops_option = [];
        if (!this.modelEdit.idShop || this.modelEdit.idShop < 0) {
            this.modelEdit.idShop = -1;
        }
        if (!this.modelEdit.idShopDistrict) {
            this.modelEdit.idShopDistrict = -1;
        }
        if (!this.modelEdit.idShopWard) {
            this.modelEdit.idShopWard = -1;
        }
        if (this.modelEdit.orderType === 3) {//đơn nhập thì chỉ cần show ra DC
            await this._ShopsService.GetShortByLocationSelect(1, this.modelEdit.idProvince, -1, -1, -1).then(rs => {
                if (rs.status) {
                    this.listShops_option = rs.data;
                }
            });
        } else {
            await this._ShopsService.GetShortByLocationSelect(0, this.modelEdit.idProvince, -1, -1, this.modelEdit.idShop).then(rs => {
                if (rs.status) {
                    this.listShops_option = rs.data;
                }
            });
        }
    }

    async ChangeShopDistrict() {
        await this._WardsService.GetShort(this.modelEdit.idShopDistrict).then(rs => {
            if (rs.status) {
                this.shopward_options = rs.data;
            }
        });
        await this.GetShops();
    }

    async onChangeLogistics() {

    }

    async Actions(idStatus: number) {
        this._notifierService.showConfirm('Bạn có chắc muốn cập nhật đơn hàng này không?', 'Xác nhận').then(rs => {
            this.isLoading = true;
            let form = {
                idOrder: this.modelEdit.id,
                idStatus: idStatus,
            }
            this._OrdersService.Actions(form).then(re => {
                if (re.status) {
                    this._notifierService.showSuccess(re.message);
                    this.isShow = false;
                    this.isView = false;

                    this.closePopup.emit(re.data);
                } else {
                    this._notifierService.showError(re.message);
                }
                this.isLoading = false;
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    async GetShipFeeLogistics() {
        this.isLoading = true;
        this._OrdersService.GetAndSaveCODLogistics(this.modelEdit.id, this.modelEdit.logisticId, this.modelEdit.tranportId).then(re => {
            if (re.status) {
                this.modelEdit.shipRoot = re.data.shipRoot;
                this._notifierService.showSuccess(re.message);
            } else {
                this._notifierService.showError(re.message);
            }
            this.isLoading = false;
        });
    }

    ShowButtonByStatus(item: any, statusChange: string) {
        //console.log("statusChange = " + statusChange)
        if (this.lstStatus && item.idStatus) {
            var objCheck = this.lstStatus.filter(d => d.id == item.idStatus);
            if (objCheck && objCheck.length > 0) {
                var actionsStatus = objCheck[0].actions;
                if (actionsStatus && actionsStatus.indexOf(';') != -1) {
                    var lstStatus = actionsStatus.split(";");
                    return lstStatus.findIndex(d => d == statusChange) != -1;
                }
            }
        }
        return false;
    }

    async showPopup(id: number, idRef: number = 0) {
        //console.log("Id đơn hàng = " + id);
        this.isShow = true;
        this.isLoading = true;
        this.modelUpdateAction = {
            idOrder: -1,
            idStatus: 0,
            notePopup: '',
            idAction: 0,
            namePopup: ''
        };
        await this.onLoadProvinces();
        if (id > 0 || idRef > 0) {
            this.isView = true;
            await this._OrdersService.Get(id).then(async response => {
                if (response.status) {
                    if (response.data == null) {
                        this.isShow = false;
                        this._notifierService.showError('Không tìm thấy đơn hàng này !!!');
                    } else {
                        //console.log("chi tiet don hang = " + JSON.stringify(response.data));
                        this.omicallLogIds = "";
                        this.detailCall = [];
                        this.omicallLogs = [];
                        this.hideme = [];
                        this.omicallOrderLogs = [];
                        this.modelEdit = response.data;
                        this.modelEdit.idOrder = this.modelEdit.id;
                        this.dataSource = response.data.orderDetails;
                        this.isVerified = this.modelEdit.isPrepay === true ? 1 : 0;
                        this.paymentChannel = this.modelEdit.paymentChannel;
                        this.crrShop = response.data.idShop;
                        this.modelEdit.logisticId = this.modelEdit.logisticId ? this.modelEdit.logisticId : this.modelInfo.idDeliveryUnit;
                        await this.onChangeLogistics();
                        this.modelEdit.tranportId = this.modelEdit.tranportId ? this.modelEdit.tranportId : this.modelInfo.idTranport;
                        await this.onLoadStatus();
                        await this.loadStatus();
                        await this.loadActions();
                        await this.onLoadDistricts();
                        await this.onLoadWards();
                        await this.GetShops();
                        await this.loadHistoryAction();
                        await this.loadHistoryStatus();
                        await this.loadOmicallOrderLogs();
                        if (this.modelEdit.deliveryDate) {
                            this.modelEdit.deliveryDate = this.addHours(-7, new Date(this.modelEdit.deliveryDate));
                        }
                    }
                }
                this.isLoading = false;
            }, () => {
                this._notifierService.showHttpUnknowError();
            });
        } else {
            this.isView = false;
            this.modelEdit = {
                idProvince: 0,
                idDistrict: 0,
                idWard: 0,
                total: 0,
                totalBill: 0,
                productReward: 0,
                promotionReward: 0,
                prepayReward: 0,
                totalGift: 0,
                ship: 0
            };
            this.dataSource = [];
        }
    }

    addHours(numOfHours, date = new Date()) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

        return date;
    }

    async autoComplete(event) {
        const query = event.query;
        let ids = '';
        if (this.dataSource != null) {
            ids = this.dataSource.map((obj) => obj.id).toString();
        }
        await this._ProductRegService.Autocomplete(
            query,
            ids,
            (this.page - 1) * this.limit,
            this.limit,
            ''
        ).then(rs => {
            if (rs.status) {
                this.results = rs.data;
                this.total = rs.totalRecord;
            }
        });
    }

    onSelect(event) {
        this.dataSource.push(event);
        event.quantity = 1;
        this.key = null;
        this.changeOder();
    }

    onRemove(index: number): void {
        this.dataSource.splice(index, 1);
        this.changeOder();
    }

    changeOder() {
        this.modelEdit.productReward = 0;
        this.modelEdit.promotionReward = 0;
        this.modelEdit.promotion = null;
        this.modelEdit.idPromotion = null;
        this.modelEdit.discount = 0;
        this.modelEdit.orderGifts = null;
        this.modelEdit.totalGift = 0;
        this.orderSum();
        this.GetShipFee();
        this.orderSumReward();
    }

    async GetShipFee() {
        this.modelEdit.OrderDetails = this.dataSource;
        this.modelEdit.isPrepay = this.isVerified == 1;
        if (this.modelEdit.idProvince > 0 && this.modelEdit.idDistrict > 0 && this.modelEdit.idWard > 0 && this.modelEdit.OrderDetails.length > 0) {
            this.isLoading = true;
            await this._OrdersService.GetShipFee(this.modelEdit).then(rs => {
                if (rs.status) {
                    if (rs.data.length <= 0) {
                        this.modelEdit.ship = 0;
                    } else {
                        this.modelEdit.ship = rs.data.map(s => s.cod).reduce((total, num) => total + num);
                    }
                } else {
                    this._notifierService.showError(rs.message);
                }
                this.isLoading = false;
            });
        } else {
            this.modelEdit.ship = 0;
        }
    }

    orderSum() {
        if (this.dataSource.length <= 0) {
            this.modelEdit.total = 0;
        } else {
            this.modelEdit.total = this.dataSource.map(s => s.price * s.quantity).reduce((total, num) => total + num);
        }
    }

    async onUpdateOrder() {
        this.isLoading = true;
        var mess = 'Bạn có chắc muốn cập nhật đơn hàng này không?';
        var lstRole = JSON.parse(this.crrUser.roleassign);
        if (lstRole.filter(d => d.toUpperCase() === 'SHOP').length > 0) {
            if (this.crrShop > 0 && this.modelEdit.idShop > 0 && this.crrShop !== this.modelEdit.idShop) {
                mess = 'Chuyển đơn hàng sang cửa hàng khác, bạn sẽ không còn quản lý đơn hàng này. Bạn có chắc chắn?'
            }
        }
        var deliveryDateShow = new Date(this.modelEdit.deliveryDate);

        this.modelEdit.deliveryDate = moment(deliveryDateShow).format('YYYY-MM-DD HH:mm');

        await this._notifierService.showConfirm(mess, 'Xác nhận').then(rs => {
            this._OrdersService.UpdateOrder(this.modelEdit).then(rs => {
                if (rs.status) {
                    this._notifierService.showSuccess(rs.message);

                    if (lstRole.filter(d => d.toUpperCase() === 'SHOP').length > 0) {
                        if (this.crrShop > 0 && this.modelEdit.idShop > 0 && this.crrShop !== this.modelEdit.idShop) {
                            this.modelEdit.isDeleted = true;
                        }
                    } else {

                    }
                    this.closePopup.emit(this.modelEdit);
                    this.isShow = false;
                } else {
                    this._notifierService.showError(rs.message);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
            return false;
        });
        this.isLoading = false;
    }

    orderSumReward() {
        if (this.modelEdit.id == null) {
            if (this.dataSource.length <= 0) { return 0; }

            this.modelEdit.productReward = 0;
            this.dataSource.forEach(s => {
                const percent = this.isVerified == 1 ? s.currentReward + 2 : s.currentReward;

                this.modelEdit.productReward += s.price / 100 * percent * s.quantity;
            });
        }
        this.modelEdit.totalReward = this.modelEdit.productReward + this.modelEdit.promotionReward - this.modelEdit.totalGift;
    }

    async UpdateStatusOrder() {
        this.modelUpdateAction.idOrder = this.modelEdit.id;
        if ((!this.modelUpdateAction.idStatus || this.modelUpdateAction.idStatus <= 0)) {
            this._notifierService.showError("Chọn trạng thái !");
            this.isLoading = false;
            return false;
        }
        let selectStatus = this.status_options.find(d => d.value == this.modelUpdateAction.idStatus);
        if (typeof selectStatus === "undefined") {
            this._notifierService.showError("Chọn trạng thái !");
            this.isLoading = false;
            return false;
        }
        let title = "";
        if (this.modelUpdateAction.idStatus && this.modelUpdateAction.idStatus > 0) {
            title += " " + selectStatus.label;
        }
        // this.modelEdit.idStatus = this.modelEdit.idStatusPopup;
        this.modelUpdateAction.note = this.modelUpdateAction.notePopup;
        this._notifierService.showConfirm(`Bạn muốn cập nhật trạng thái đơn hàng thành: <b>${title}</b> ?`, 'Xác nhận').then(rs => {
            this.isLoading = true;
            this._OrdersService.Actions(this.modelUpdateAction).then(re => {
                if (re.status) {
                    this.showPopup(this.modelUpdateAction.idOrder);
                    // this.loadStatus();
                    // this.loadHistoryStatus();
                    this.closePopup.emit(re.data);
                    this._notifierService.showSuccess(re.message);
                } else {
                    this._notifierService.showError(re.message);
                }
                this.isLoading = false;
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    async UpdateActionOrder() {
        this.modelUpdateAction.idOrder = this.modelEdit.id;
        if (!this.modelUpdateAction.idAction || this.modelUpdateAction.idAction <= 0) {

        }
        let selectAction = this.actions_options.find(d => d.value == this.modelUpdateAction.idAction);
        if (typeof selectAction === "undefined") {
            this._notifierService.showError("Chọn tác nghiệp!");
            this.isLoading = false;
            return false;
        }
        let title = "";
        if (this.modelUpdateAction.idAction && this.modelUpdateAction.idAction > 0) {
            title = " " + selectAction.label;
        }

        // this.modelEdit.idAction = this.modelEdit.idActionPopup;
        this.modelUpdateAction.name = this.modelUpdateAction.namePopup;
        this._notifierService.showConfirm(`Bạn muốn cập nhật trạng thái tác nghiệp đơn hàng thành: <b>${title}</b> ?`, 'Xác nhận').then(rs => {
            this.isLoading = true;
            this._OrdersService.ActionsActions(this.modelUpdateAction).then(re => {
                if (re.status) {
                    this.updateActionOmicallLog(re);
                    this.showPopup(this.modelUpdateAction.idOrder);
                    // this.loadActions();
                    // this.loadHistoryAction();
                    this.closePopup.emit(re.data);
                    this._notifierService.showSuccess(re.message);
                } else {
                    this._notifierService.showError(re.message);
                }
                this.isLoading = false;
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    callOmiCall(phone) {
        omiSDK.makeCall(phone, { datas: { 'User-Data': "orderid_" + this.modelEdit.idOrder } });
    }

    async updateActionOmicallLog(response: any) {
        if (this.omicallLogIds) {
            var jsonbody = {
                IdAction: response.data.orderActions[0].id,
                IdOrder: response.data.orderActions[0].idOrder,
                OmicallLogs: "" + this.omicallLogIds
            }
            await this._OmicallLogsService.UpdateActionLog(jsonbody)
                .then(res => {
                    this.omicallLogIds = "";
                    this.omicallLogs = [];
                    if (!res.status) this._notifierService.showError(res.message);
                });
        }
    }
    async showOmicallsLogOrderAction(index: any, id: any) {
        if (!this.omicallLogs[index] || this.omicallLogs[index] == JSON.stringify([])) {
            await this._OmicallLogsService.GetLogByOrderAction(id).then(res => {
                if (res.status) {
                    this.omicallLogs[index] = res.data;
                }
                else this._notifierService.showError(res.message);
            });
        }
        if (JSON.stringify(this.omicallLogs[index]) != JSON.stringify([])) {
            this.hideme[index] = !this.hideme[index];
            this.Index = index;
        }
    }
}
