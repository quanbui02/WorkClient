import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { User } from '../../../../lib-shared/models/user';
import { UserService } from '../../../../lib-shared/services/user.service';
import { OrdersService } from '../../../services/orders.service';
import { StatusService } from '../../../services/status.service';
import { ActionsService } from '../../../services/actions.service';

@Component({
    selector: 'app-orders-multi-action',
    templateUrl: './orders-multi-action.component.html',
    styleUrls: ['./orders-multi-action.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrdersMultiActionComponent extends SecondPageEditBase
    implements OnInit {
    item: any = {};
    cols = [];
    dataSource = [];
    status_optionsPopup: any = [];
    actions_optionsPopup: any = [];
    lstUniqueIdStatus: any = [];
    lstUniqueIdActions: any = [];
    modelEdit: any = {
        ids: [],
    };
    totalMoneyProduct = 0;
    totalMoneyShip = 0;
    totalOrders = 0;
    totalDiscount = 0;
    isLoading = false;
    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        protected _translateService: TranslateService,
        private _OrdersService: OrdersService,
        public _StatusService: StatusService,
        public _ActionsService: ActionsService,
    ) {
        super(null, _injector);
        this.formGroup = this.formBuilder.group({
            idActionPopup: [''],
            idStatusPopup: [''],
            namePopup: [''], //note action
            notePopup: ['']
        });
    }

    async ngOnInit() {
        this.cols = [
            {
                field: 'id',
                header: 'Mã',
                visible: true,
                align: 'center',
            },
            {
                field: 'code',
                header: 'Mã đơn',
                visible: true,
                align: 'center',
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                dataType: 'date',
                align: 'center',
            },
            {
                field: 'name',
                header: 'Họ và tên',
                visible: true,
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
                visible: true,
                align: 'center',
            },
            {
                field: 'isPrepay',
                header: 'TT thanh toán',
                visible: true,
                align: 'center',
            },
            {
                field: 'total',
                header: 'Tiền hàng',
                dataType: 'number',
                visible: true,
                align: 'right',
            },
            {
                field: 'ship',
                header: 'Vận chuyển',
                dataType: 'number',
                visible: true,
                align: 'right',
            },
            {
                field: 'discount',
                header: 'Khuyến mãi',
                dataType: 'number',
                visible: true,
                align: 'right',
            },
            {
                field: 'totalBill',
                header: 'Tổng tiền',
                dataType: 'number',
                visible: true,
                align: 'right',
            },
        ];
    }

    async loadStatus() {
        this.isLoading = true;
        await this._StatusService.GetListByRolesByStatus(this.lstUniqueIdStatus.join(';')).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.status_optionsPopup.push({ label: item.name, value: item.id });
                });
            }
        });
        this.isLoading = false;
    }

    async onRemoveList(item) {
        this.dataSource.splice(this.dataSource.indexOf(item), 1);
        await this.showPopup(this.dataSource);
    }

    async loadActions() {
        this.isLoading = true;
        await this._ActionsService.GetListByRolesByStatus(this.lstUniqueIdStatus.join(';'), this.lstUniqueIdActions.join(';')).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.actions_optionsPopup.push({ label: item.name, value: item.id });
                });
            }
        });
        this.isLoading = false;
    }

    async showPopup(item: any) {
        this.isShow = true;
        this.lstUniqueIdStatus = [];
        this.lstUniqueIdActions = [];
        this.modelEdit.ids = [];
        this.modelEdit.idStatusPopup = 0;
        this.modelEdit.idActionPopup = 0;
        this.modelEdit.namePopup = "";
        this.modelEdit.notePopup = "";

        this.dataSource = item;
        this.dataSource.forEach(item => {
            this.modelEdit.ids.push(item.id);
        });
        this.status_optionsPopup = [];
        this.actions_optionsPopup = [];
        this.totalMoneyProduct = item.filter(item => item.total)
            .reduce((sum, current) => sum + current.total, 0);
        this.totalMoneyShip = item.filter(item => item.ship)
            .reduce((sum, current) => sum + current.ship, 0);
        this.totalOrders = item.filter(item => item.totalBill)
            .reduce((sum, current) => sum + current.totalBill, 0);
        this.totalDiscount = item.filter(item => item.discount)
            .reduce((sum, current) => sum + current.discount, 0);
        this.GetData();
        this.loadStatus();
        this.loadActions();
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    async GetData() {
        var list: any[] = [];
        var list2: any[] = [];
        this.dataSource.forEach(item => {
            list.push(item.idStatus);
            if (item.idAction) {
                list2.push(item.idAction);
            } else {
                list2.push(1);
            }
        });

        this.lstUniqueIdStatus = list.filter(this.onlyUnique);
        this.lstUniqueIdActions = list2.filter(this.onlyUnique);
    }

    async onSave() {
        await this.Actions();
    }

    async Actions() {
        let title = "";
        if ((!this.modelEdit.idStatusPopup || this.modelEdit.idStatusPopup <= 0) && (!this.modelEdit.idActionPopup || this.modelEdit.idActionPopup <= 0)) {
            this._notifierService.showError("Chọn tác nghiệp hoặc trạng thái !");
            return false;
        }

        if (this.modelEdit.idActionPopup && this.modelEdit.idActionPopup > 0) {
            title = " " + this.actions_optionsPopup.find(d => d.value == this.modelEdit.idActionPopup).label;
        }

        if (this.modelEdit.idStatusPopup && this.modelEdit.idStatusPopup > 0) {
            title += " " + this.status_optionsPopup.find(d => d.value == this.modelEdit.idStatusPopup).label;
        }
        if (title !== "") {
            this._notifierService.showConfirm(`Bạn muốn cập nhật thành:<b>${title}</b> ?`, 'Xác nhận').then(rs => {
                if (this.modelEdit.idStatusPopup && this.modelEdit.idStatusPopup > 0) {
                    this.isLoading = true;
                    this._OrdersService.MultiActions(this.modelEdit).then(re => {
                        if (re.status) {
                            this.closePopup.emit(re.data);
                            this._notifierService.showSuccess(re.message);
                            this.isShow = false;
                        } else {
                            this._notifierService.showError(re.message);
                        }
                    });
                }

                if (this.modelEdit.idActionPopup && this.modelEdit.idActionPopup > 0) {
                    this.isLoading = true;
                    this._OrdersService.MultiActionsActions(this.modelEdit).then(re => {
                        if (re.status) {
                            this.closePopup.emit(re.data);
                            this._notifierService.showSuccess(re.message);
                            this.isShow = false;
                        } else {
                            this._notifierService.showError(re.message);
                        }
                    });
                }

            }).catch(err => {
                this._notifierService.showDeleteDataError();
            });
        }

        this.isLoading = false;
    }

}

