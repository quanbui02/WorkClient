import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { DialogService, DynamicDialogRef, MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { User } from '../../../../lib-shared/models/user';
import { UserService } from '../../../../lib-shared/services/user.service';
import { EnumOrderStatus, PromotionType } from '../../../common/constant';
import { ChooseGiftComponent } from '../../../ctv/orders/choose-gift/choose-gift.component';
import { ChoosePromotionComponent } from '../../../ctv/orders/choose-promotion/choose-promotion.component';
import { DistrictsService } from '../../../services/districts.service';
import { OrdersService } from '../../../services/orders.service';
import { ProductRegService } from '../../../services/productregs.service';
import { PromotionsService } from '../../../services/promotions.service';
import { ProvincesService } from '../../../services/provinces.service';
import { WardsService } from '../../../services/wards.service';

@Component({
    selector: 'app-order-admin-edit',
    templateUrl: './order-admin-edit.component.html',
    styleUrls: ['./order-admin-edit.component.scss']
})
export class OrderAdminEditComponent extends SecondPageEditBase
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
    results: any;
    key: string;
    khachCu: string;
    listKhachCu: any;
    selectedKhachCu: any;
    ref: DynamicDialogRef;
    enumOrderStatus = EnumOrderStatus;

    province_options: any[]; // = [{ label: '-- Tỉnh/TP --', value: 0 }];
    distric_options: any[]; // = [{ label: '-- Quận huyện--', value: 0 }];
    ward_options: any[]; // = [{ label: '-- Xã phường --', value: 0 }];

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
        ship: 0
    };
    isVerified = 1;
    crrUser: User;

    listImage: any[] = [];
    constructor(
        protected _injector: Injector,
        private _OrdersService: OrdersService,
        private _ProvincesService: ProvincesService,
        private _DistrictsService: DistrictsService,
        private _ProductRegService: ProductRegService,
        private _WardsService: WardsService,
        public dialogService: DialogService,
        public _PromotionsService: PromotionsService,
        private _UserService: UserService,
        private messageService: MessageService
    ) {
        super(null, _injector);

        // this.formGroup = this.formBuilder.group({
        //     name: ['', Validators.compose([Validators.required])],
        //     idProvince: ['', Validators.compose([Validators.required])],
        //     idDistrict: ['', Validators.compose([Validators.required])],
        //     idWard: ['', Validators.compose([Validators.required])],
        //     address: ['', Validators.compose([Validators.required])],
        //     note: [''],
        //     isVerified: [''],
        //     myRadio: [''],
        //     khachCu: [''],
        //     phone: ['', Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\d{11}|\d{12}|(\+84\d{10}))$/)])],
        // });

        this.formGroup = new FormGroup({
            name: new FormControl('', Validators.compose([Validators.required])),
            idProvince: new FormControl('', Validators.compose([Validators.required])),
            idDistrict: new FormControl('', Validators.compose([Validators.required])),
            idWard: new FormControl('', Validators.compose([Validators.required])),
            address: new FormControl('', Validators.compose([Validators.required])),
            note: new FormControl(''),
            isVerified: new FormControl(''),
            myRadio: new FormControl(''),
            khachCu: new FormControl(''),
            // myRadio: ['Option 1', []] // This set default value
            phone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^((84|0[3|5|7|8|9])+([0-9]{8})\b)$/)])),
        });

    }

    async ngOnInit() {
        this.crrUser = await this._UserService.getCurrentUser();

        // this.val2 = 'Option 2';
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

    // async GetData() {
    //     await this._OrderDetailsService.Gets(this.modelEdit.id).then(rs => {
    //         if (rs.status) {
    //             this.dataSource = rs.data;
    //         }
    //     });
    // }

    async save() {
        this.isView = true;
        this.isLoading = true;
        this.modelEdit.OrderDetails = this.dataSource;
        this.modelEdit.isVerified = this.isVerified;
        // if (this.modelEdit.promotion != null) {
        //     this.modelEdit.idPromotion = this.rewardSelected.id;
        // }
        // if (this.modelEdit.idProvince <=0 &&this.modelEdit.idProvince <=0 &&this.modelEdit.idProvince <=0) {
        //     this._notifierService.showError('Thông tin địa chỉ phải nhập đầy đủ');
        // }
        if (this.dataSource.length <= 0) {
            this._notifierService.showError('Bạn chưa chọn sản phẩm !');
        }

        this._OrdersService.post(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
                this.formGroup.reset();
                this.isShow = false;
                rs.data.forEach(element => {
                    this.closePopup.emit(element.idRef);
                });
                this.modelEdit = {};
                this.dataSource = [];
            } else {
                this._notifierService.showError(rs.message);
            }
            this.isView = false;
            this.isLoading = false;
        });
    }

    async Payment() {
        this._notifierService.showConfirm('Bạn có chắc muốn thanh toán đơn hàng này không ?', 'Thanh toán đơn hàng ?').then(rs => {
            this.isLoading = true;
            this._OrdersService.Payment(this.modelEdit.id).then(re => {
                if (re.status) {
                    this._notifierService.showSuccess(re.message);
                    this.isShow = false;
                    this.isView = false;
                    this.closePopup.emit(this.modelEdit.idRef);
                } else {
                    this._notifierService.showError(re.message);
                }
                this.isLoading = false;
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    async CancelContact(type: number) {
        this._notifierService.showConfirm('Bạn có chắc muốn hủy đơn hàng này không ?', 'Hủy đơn hàng ?').then(rs => {
            this.isLoading = true;
            this._OrdersService.CancelContact(this.modelEdit.id).then(re => {
                if (re.status) {
                    this._notifierService.showSuccess(re.message);
                    this.isShow = false;
                    this.isView = false;
                    this.closePopup.emit(this.modelEdit.idRef);
                } else {
                    this._notifierService.showError(re.message);
                }
                this.isLoading = false;
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    async showPopup(id: any) {
        this.isShow = true;
        await this.onLoadProvinces();

        if (id > 0) {
            this.isView = true;
            await this._OrdersService.GetByIdRef(id).then(async response => {
                if (response.status) {
                    if (response.data == null) {
                        this.isShow = false;
                        this._notifierService.showError('Không tìm thấy đơn hàng này !!!');
                    } else {
                        this.modelEdit = response.data;
                        this.dataSource = response.data.orderDetails;
                        this.isVerified = this.modelEdit.isPrepay === true ? 1 : 0;

                        await this.onLoadDistricts();
                        await this.onLoadWards();
                    }
                }
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
        this.modelEdit.isVerified = this.isVerified == 1;
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

    // clearItem(autocomplete: any) {
    //     autocomplete.value = '';
    //     autocomplete.handleDropdownClick();
    // }

    orderSum() {
        if (this.dataSource.length <= 0) {
            this.modelEdit.total = 0;
        } else {
            this.modelEdit.total = this.dataSource.map(s => s.price * s.quantity).reduce((total, num) => total + num);
        }
    }

    // orderSumReward() {
    //     if (this.dataSource.length <= 0) { return 0; }
    //     return this.dataSource.map(s => s.price / 100 * s.currentReward * s.quantity).reduce((total, num) => total + num);
    // }

    orderSumReward() {
        if (this.modelEdit.id == null) {
            if (this.dataSource.length <= 0) { return 0; }

            this.modelEdit.productReward = 0;
            this.dataSource.forEach(s => {
                // Nếu  có quà tặng là sản phẩm thì thưởng trừ đi sản phẩm quà tặng
                // if (this.modelEdit.orderGifts == null) {
                //     this.modelEdit.orderGifts = [];
                // }
                // const orderGift = this.modelEdit.orderGifts.find(x => x.idProduct === s.idProduct);
                // const quantity = orderGift != null ? s.quantity - orderGift.quantity : s.quantity;

                // Nếu thanh toán trước thì + thêm 2%
                const percent = this.isVerified == 1 ? s.currentReward + 2 : s.currentReward;

                this.modelEdit.productReward += s.price / 100 * percent * s.quantity;
            });
        }
        this.modelEdit.totalReward = this.modelEdit.productReward + this.modelEdit.promotionReward - this.modelEdit.totalGift;
    }

    // CodSum() {
    //     if (this.dataCOD.length <= 0) {
    //         this.order_Ship = 0;
    //     } else {
    //         this.order_Ship = this.dataCOD.map(s => s.cod).reduce((total, num) => total + num);
    //     }
    //     return this.order_Ship;
    // }

    // DiscountSum() {
    //     if (this.dataCOD.length <= 0) { return 0; }
    //     return this.dataCOD.map(s => s.discount).reduce((total, num) => total + num);
    // }

    // TotalBillSum() {
    //     if (this.dataCOD.length <= 0) { return 0; }
    //     return this.dataCOD.map(s => s.lastTotalBill).reduce((total, num) => total + num);
    // }

    showPromotions() {
        let ids = '';
        if (this.dataSource.length > 0) {
            ids = this.dataSource.map((obj) => obj.id).toString();
        }
        else
            this._notifierService.showError("Chưa chọn sản phẩm !");

        this.ref = this.dialogService.open(ChoosePromotionComponent, {
            data: {
                ids: ids,
                quantity: this.modelEdit.OrderDetails.map(s => s.quantity).reduce(s => (total, num) => total + num),
                totalBill: this.modelEdit.total
            },
            header: 'Chọn chương trình khuyến mãi',
            width: '40%',
            contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
            baseZIndex: 10000
        });

        this.ref.onClose.subscribe((item: any) => {
            if (item) {
                this.modelEdit.idPromotion = item.id;
                this.modelEdit.promotion = item;
                this.modelEdit.OrderDetails = this.dataSource;
                this.modelEdit.totalBill = this.modelEdit.total;
                this.isLoading = true;
                this._PromotionsService.GetByOrderSelected(this.modelEdit).then(rs => {
                    if (rs.status) {
                        if (item.type == PromotionType.GiamTrucTiepTrenDonHang) {
                            this.modelEdit.discount = rs.data;
                            this.modelEdit.totalBill -= rs.data;
                            this.modelEdit.totalReward = 0;
                        } else {
                            this.modelEdit.promotionReward = rs.data;
                            this.modelEdit.totalReward = this.modelEdit.productReward + this.modelEdit.promotionReward;
                        }
                    }
                });
                this.isLoading = false;
            }
        });
    }

    showGifts() {
        let ids = '';
        if (this.dataSource != null) {
            ids = this.dataSource.map((obj) => obj.id).toString();
        }
        this.ref = this.dialogService.open(ChooseGiftComponent, {
            data: {
                orderDetails: this.modelEdit.OrderDetails,
                totalBill: this.modelEdit.total,
                ship: this.modelEdit.ship,
                totalReward: this.modelEdit.totalReward
            },
            header: 'Chọn quà tặng cho khách hàng',
            width: '40%',
            contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
            baseZIndex: 10000
        });

        this.ref.onClose.subscribe((list: any) => {
            if (list != null && list.length > 0) {
                this.modelEdit.orderGifts = list;
                this.modelEdit.totalGift = list.map(s => s.value).reduce((total, num) => total + num);
                this.orderSumReward();
                this.isLoading = false;
            }
        });
    }

    async autoCompleteKhachCu(event) {
        const query = event.query;
        await this._OrdersService.FindCustommerByPhone(query, (this.page - 1) * this.limit).then(rs => {
            if (rs.status) {
                rs.data.forEach(element => {
                    element.fullInfo = element.name + ' - ' + element.phone + ' - ' + element.fullInfo;
                });
                this.listKhachCu = rs.data;
            }
        });
    }

    async onSelectKhachCu(event) {
        this.selectedKhachCu = event;
        this.khachCu = null;
        // Set thông tin khách cũ
        this.modelEdit.address = this.selectedKhachCu.address;
        this.modelEdit.idProvince = this.selectedKhachCu.idProvince;
        await this.onLoadDistricts();
        this.modelEdit.idDistrict = this.selectedKhachCu.idDistrict;

        await this.onLoadWards();
        this.modelEdit.idWard = this.selectedKhachCu.idWard;

        this.modelEdit.name = this.selectedKhachCu.name;
        this.modelEdit.phone = this.selectedKhachCu.phone;
    }
}

