import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/primeng';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { EnumOrderStatus } from '../../../common/constant';
import { OrdersService } from '../../../services/orders.service';
import { StatusService } from '../../../services/status.service';

@Component({
  selector: 'app-order-status-update',
  templateUrl: './order-status-update.component.html',
  styleUrls: ['./order-status-update.component.scss']
})
export class OrderStatusUpdateComponent extends SecondPageEditBase implements OnInit {
  isLoading = false;
  status_options: any[];
  modelEdit: any = {
    id: 0,
  };

  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _OrdersService: OrdersService,
    public _StatusService: StatusService
  ) {
    super(null, _injector);
    this.formGroup = this.formBuilder.group({
      idStatus: ['', Validators.required],
      note: ['']
    });
  }

  async ngOnInit() {
    this.modelEdit.idOrder = this.config.data.idOrder;
    this.loadStatus();
  }

  async loadStatus() {
    this.isLoading = true;
    await this._StatusService.GetShort('').then(rs => {
      if (rs.status) {
        let obj = rs.data.find(s => s.value == this.config.data.idStatus);
        if (obj && obj.actions && obj.actions.indexOf(";") != -1) {
          var lstActions = obj.actions.split(';').map(Number);
          this.status_options = rs.data.filter(s => lstActions.includes(s.value));
        }
      }
    });
    this.isLoading = false;
  }

  closeAndSelected() {
    this.isShow = false;
    this.isLoading = false;
    this.ref.close(null);
  }

  async onSave() {
    await this.Actions();
  }

  async Actions() {
    let title = "";
    title = this.status_options.find(d => d.value == this.modelEdit.idStatus).label;
    this._notifierService.showConfirm(`Bạn muốn cập nhật trạng thái đơn hàng thành: <b>${title}</b> ?`, 'Xác nhận').then(rs => {
      this.isLoading = true;
      this._OrdersService.Actions(this.modelEdit).then(re => {
        if (re.status) {
          this._notifierService.showSuccess(re.message);
          this.ref.close(re.data);
        } else {
          this._notifierService.showError(re.message);
        }
        this.isLoading = false;
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

}
