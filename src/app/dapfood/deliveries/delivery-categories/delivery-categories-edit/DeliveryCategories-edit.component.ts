import { DeliveryCategoriesService } from '../../services/deliverycategories.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';


@Component({
  selector: 'app-DeliveryCategories-edit',
  templateUrl: './DeliveryCategories-edit.component.html',
  styleUrls: ['./DeliveryCategories-edit.component.scss']
})
export class DeliveryCategoriesEditComponent extends SecondPageEditBase
  implements OnInit {
  isLoading = false;
  modelEdit: any = {};
  deliveryCategoriesId: number;

  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _deliveryCategoriesService: DeliveryCategoriesService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: [''],
      code: [],
      endPoint: []
    });

    this.deliveryCategoriesId = this.config.data.deliveryCategoriesId;
    this.getData(this.deliveryCategoriesId);
  }

  save() {
    this._deliveryCategoriesService.Save(this.modelEdit).then(rs => {
      if (rs.status) {
        this._notifierService.showSuccess('Cập nhật thành công');
        this.isShow = false;
        this.closePopup.emit();
        this.modelEdit = {};
      } else {
        this._notifierService.showError(rs.message);
      }
      this.ref.close();
    });
  }

  async getData(id: any) {
    this.isShow = true;
    if (id > 0) {
      await this._deliveryCategoriesService.GetById(id)
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
    this.ref.close(null);
  }
}


