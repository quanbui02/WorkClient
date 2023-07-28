import { LessonRatesService } from './../../services/lessonRates.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-lessonRates-edit',
  templateUrl: './lessonRates-edit.component.html',
  styleUrls: ['./lessonRates-edit.component.scss']
})
export class LessonRatesEditComponent extends SecondPageEditBase
  implements OnInit {
  @Input() status_options: any[];
  @Input() cate_options: any[];
  isLoading = false;
  modelEdit: any = {};
  star_options: any[];
  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _lessonRatesService: LessonRatesService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      rating: [''],
      comment: ['']
    });

    this.loadStarRating();
  }

  async loadStarRating() {
    this.star_options = [{ label: '5★', value: 5 }];
    this.star_options.push({ label: '4★', value: 4 });
    this.star_options.push({ label: '3★', value: 3 });
    this.star_options.push({ label: '2★', value: 2 });
    this.star_options.push({ label: '1★', value: 1 });
  }

  save() {
    this._lessonRatesService.UpdateRatingById(this.modelEdit.id, this.modelEdit.rating, this.modelEdit.comment).then(rs => {
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
      await this._lessonRatesService.GetById(id)
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



