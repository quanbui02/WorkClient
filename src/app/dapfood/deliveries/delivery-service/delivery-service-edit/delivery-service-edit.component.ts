import { DeliveriesService } from './../../services/deliveries.service';
import { DeliveryCategoriesService } from '../../services/deliverycategories.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { ShopsService } from '../../../services/shops.service';
import { User } from '../../../../lib-shared/models/user';
import { UserService } from '../../../../lib-shared/services/user.service';


@Component({
  selector: 'app-delivery-service-edit',
  templateUrl: './delivery-service-edit.component.html',
  styleUrls: ['./delivery-service-edit.component.scss']
})
export class DeliveryServiceEditComponent extends SecondPageEditBase
  implements OnInit {
  isLoading = false;
  modelEdit: any = {};
  deliveryId: number;
  delivery_options = [];
  clientShop_options: any[] = [];
  clientShops: any[] = [];
  crrUser: User;
  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _deliveriesService: DeliveriesService,
    private _deliveryCategoriesService: DeliveryCategoriesService,
    private _ShopsService: ShopsService,
    private _UserService: UserService,
    // public config: DynamicDialogConfig,
    // public ref: DynamicDialogRef,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {

    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      token: ['', Validators.required],
      idDeliveryCategory: ['', Validators.required],
      clientShops: []
    });
    this.crrUser = await this._UserService.getCurrentUser();
    // this.deliveryId = this.config.data.deliveryId;
    // await this.getData(this.deliveryId);
    await this.loadDeliveryOption();
    await this.loadClientShops();
  }

  // danh sách sản phầm
  async loadClientShops() {
    this.clientShops = [];
    this.clientShop_options = [];
    await this._ShopsService.GetByIdClient(this.crrUser.idClient.toString(), -1, -1).then(rs => {
      if (rs.status) {
        //console.log("danh muc san pham = " + JSON.stringify(rs.data));
        rs.data.forEach(item => {
          this.clientShop_options.push({ label: item.name, value: item.id });
        });
      }
    });
  }

  async loadDeliveryOption() {
    await this._deliveryCategoriesService.Gets("", 0, 1000, "", false).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.delivery_options.push({ label: value.name, value: value.id });
        });
      }
    });
  }

  save() {
    this._deliveriesService.Save(this.modelEdit).then(rs => {
      if (rs.status) {
        this._notifierService.showSuccess('Cập nhật thành công');
        this.isShow = false;
        this.closePopup.emit();
        this.modelEdit = {};
      } else {
        this._notifierService.showError(rs.message);
      }
      // this.ref.close();
    });
  }

  async showPopup(id: any) {
    this.isShow = true;
    if (id > 0) {
      await this._deliveriesService.GetById(id)
        .then(async response => {
          if (response.status) {
            this.modelEdit = response.data;
          }
        }, () => {
          this._notifierService.showHttpUnknowError();
        });
    } else {
      this.modelEdit = {};
    }
  }

  closeForm() {
    // this.ref.close(null);
  }
}


