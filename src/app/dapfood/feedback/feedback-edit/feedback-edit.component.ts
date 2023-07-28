import { FeedbacksService } from './../../services/feedback.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-feedback-edit',
  templateUrl: './feedback-edit.component.html',
  styleUrls: ['./feedback-edit.component.scss']
})
export class FeedbackEditComponent extends SecondPageEditBase
  implements OnInit {
  @Input() status_options: any[];
  @Input() cate_options: any[];
  isLoading = false;
  modelEdit: any = {};
  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _feedbackService: FeedbacksService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      content: [''],
      note: [''],
      images: [''],
      idFeedbackStatus: ['']
    });
  }

  save() {
    this._feedbackService.UpdateStatus(this.modelEdit).then(rs => {
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
      await this._feedbackService.getDetail(id)
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


