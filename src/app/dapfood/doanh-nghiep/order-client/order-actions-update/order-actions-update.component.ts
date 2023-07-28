import { async } from '@angular/core/testing';
import { OmiCallLogsService } from './../../../services/OmiCallLogs.service';
import { Response } from './../../../../shared/response';
import { Component, DoCheck, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/primeng';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { OrdersService } from '../../../services/orders.service';
import { StatusService } from '../../../services/status.service';
import { ActionsService } from '../../../services/actions.service';
import { OrderStatusService } from '../../../services/orderstatus.service';
import { OrderActionsService } from '../../../services/orderactions.service';
import { EventEmitterService } from '../../../../services/eventemitter.service';
declare var omiSDK: any;
@Component({
  selector: 'app-order-actions-update',
  templateUrl: './order-actions-update.component.html',
  styleUrls: ['./order-actions-update.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderActionsUpdateComponent extends SecondPageEditBase implements OnInit {
  isLoading = false;
  status_options: any = [];
  actions_options: any = [];
  list_actions: any = [];
  list_status: any = [];
  modelEdit: any = {
    id: 0,
  };
  crrUser: any = {};
  hideme = [];
  Index: any;
  omicallLogs: any = [];
  detailCall: any = [];
  omicallLogIds: any = "";

  subscription: any;

  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _OrdersService: OrdersService,
    public _StatusService: StatusService,
    public _ActionsService: ActionsService,
    public _OrderActionsService: OrderActionsService,
    public _OrderStatusService: OrderStatusService,
    public _OmicallLogsService: OmiCallLogsService,
    private _EventEmitterService: EventEmitterService,
  ) {
    super(null, _injector);
    this.formGroup = this.formBuilder.group({
      idAction: [''],
      idStatus: [''],
      name: [''], //note action
      note: ['']
    });
  }

  async ngOnInit() {
    this._EventEmitterService.omicall.subscribe(item => this.ShowLogsOmicall(item));

    this.modelEdit.idOrder = this.config.data.idOrder;
    this.modelEdit.phone = this.config.data.phone;
    this.crrUser = this.config.data.crrUser;
    this.omicallLogIds = "";
    this.loadStatus();
    this.loadActions();
    this.loadHistoryAction();
    this.loadHistoryStatus();
  }

  ShowLogsOmicall(item: any) {
    if (Object.keys(item).length != 0) {
      var modelOmicallUpdate = {
        Id: item.id,
        IdOrder: this.modelEdit.id
      }
      this._OmicallLogsService.UpdateOmicallLog(modelOmicallUpdate);
      if (this.omicallLogIds) this.omicallLogIds += "," + item.id;
      else this.omicallLogIds = item.id;
      if (JSON.stringify(this.detailCall) == JSON.stringify([])) this.detailCall = [item];
      else this.detailCall.push(item);
    }
  }

  async loadHistoryAction() {
    this.isLoading = true;
    await this._OrderActionsService.GetByIdOrder(this.modelEdit.idOrder).then(rs => {
      if (rs.status) {
        this.list_actions = rs.data;
      }
    });
    this.isLoading = false;
  }

  async loadHistoryStatus() {
    await this._OrderStatusService.GetByIdOrder(this.modelEdit.idOrder).then(rs => {
      if (rs.status) {
        this.list_status = rs.data;
      }
    });
  }

  async loadStatus() {
    this.isLoading = true;
    await this._StatusService.GetListByRoles().then(rs => {
      if (rs.status) {
        let obj = rs.data.find(s => s.id == this.config.data.idStatus);
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
    this.isLoading = true;
    await this._ActionsService.GetListByRoles().then(rs => {
      if (rs.status) {
        let obj = rs.data.find(s => s.id == (this.config.data.idAction ? this.config.data.idAction : 1));
        // console.log("du lieu tac nghiep = " + JSON.stringify(this.modelEdit.idAction));
        if (obj.actions1 && obj.actions1.indexOf(";") != -1) {
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

  closeAndSelected() {
    sessionStorage.removeItem("IdLogs");
    this.isShow = false;
    this.isLoading = false;
    this.ref.close(null);
  }

  async onSave() {
    await this.Actions();

  }

  async Actions() {
    this.isShow = true;
    this.isLoading = true;
    let title = "";
    if ((!this.modelEdit.idStatus || this.modelEdit.idStatus <= 0) && (!this.modelEdit.idAction || this.modelEdit.idAction <= 0)) {
      this._notifierService.showError("Chọn tác nghiệp hoặc trạng thái !");
      this.isLoading = false;
      return false;
    }

    if (this.modelEdit.idAction && this.modelEdit.idAction > 0) {
      title = " " + this.actions_options.find(d => d.value == this.modelEdit.idAction).label;
    }

    if (this.modelEdit.idStatus && this.modelEdit.idStatus > 0) {
      title += " " + this.status_options.find(d => d.value == this.modelEdit.idStatus).label;
    }
    //Update status show confirm
    //Update only action not show confirm
    if (this.modelEdit.idStatus && this.modelEdit.idStatus > 0) {
      this._notifierService.showConfirm(`Bạn muốn cập nhật thành:<b>${title}</b> ?`, 'Xác nhận').then(rs => {
        if (this.modelEdit.idStatus && this.modelEdit.idStatus > 0) {
          this._OrdersService.Actions(this.modelEdit).then(re => {
            if (re.status) {
              this.ref.close(re.data);
              this._notifierService.showSuccess(re.message);
            } else {
              this._notifierService.showError(re.message);
            }
          });
        }

        if (this.modelEdit.idAction && this.modelEdit.idAction > 0) {
          this._OrdersService.ActionsActions(this.modelEdit).then(re => {
            if (re.status) {
              this.updateActionOmicallLog(re);
              this.ref.close(re.data);
              this._notifierService.showSuccess(re.message);
            } else {
              this._notifierService.showError(re.message);
            }
          });
        }

        this.isShow = false;
      }).catch(err => {
        this._notifierService.showDeleteDataError();
      });
    }
    else {
      if (this.modelEdit.idAction && this.modelEdit.idAction > 0) {
        await this._OrdersService.ActionsActions(this.modelEdit).then(re => {
          if (re.status) {
            this.updateActionOmicallLog(re);
            this.ref.close(re.data);
            this._notifierService.showSuccess(re.message);
            this.isShow = false;
          } else {
            this._notifierService.showError(re.message);
          }
        });
      }
    }
    this.isLoading = false;
  }
  callOmiCall() {
    // console.log('log call omicall ' + JSON.stringify(this.modelEdit));
    omiSDK.makeCall(this.modelEdit.phone, { datas: { 'User-Data': "orderid_" + this.modelEdit.idOrder } });
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
