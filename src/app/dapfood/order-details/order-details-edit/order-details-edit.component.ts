import { OrderDetailsService } from './../../services/orderdetails.service';
import { FeedbacksService } from './../../services/feedback.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-order-details-edit',
  templateUrl: './order-details-edit.component.html',
  styleUrls: ['./order-details-edit.component.scss']
})
export class OrderDetailsEditComponent extends SecondPageEditBase
  implements OnInit {
  @Input() status_options: any[];
  @Input() cate_options: any[];
  isLoading = false;
  modelEdit: any = {};
  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _orderDetailsService: OrderDetailsService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      note: [''],
      idStatus: ['']
    });
  }

  save() {
    this._orderDetailsService.UpdateStatusFeedbackById(this.modelEdit.id, this.modelEdit.idStatus, this.modelEdit.note).then(rs => {
      if (rs.status) {
        this._notifierService.showSuccess('Cập nhật thành công');
        this.isShow = false;
        this.closePopup.emit();
        this.modelEdit = {};
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

  async showPopup(id: any) {
    this.isShow = true;
    if (id > 0) {
      await this._orderDetailsService.GetById(id)
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
}


