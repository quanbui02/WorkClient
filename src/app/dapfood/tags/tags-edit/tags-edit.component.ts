import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { TagsService } from './../../services/tags.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-tags-edit',
  templateUrl: './tags-edit.component.html',
  styleUrls: ['./tags-edit.component.scss']
})
export class TagsEditComponent extends SecondPageEditBase
  implements OnInit {
  isLoading = false;
  modelEdit: any = {};
  tagId: number;

  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _tagsService: TagsService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      tagName: ['']
    });

    this.tagId = this.config.data.tagId;
    this.getData(this.tagId);
  }

  save() {
    this._tagsService.Save(this.modelEdit).then(rs => {
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
      await this._tagsService.GetByTagId(id)
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


