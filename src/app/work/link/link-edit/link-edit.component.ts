import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { FormBuilder, Validators } from '@angular/forms';
import { WmShortCutLinksService } from '../../services/WmShortCutLinks.service';

@Component({
  selector: 'app-link-edit',
  templateUrl: './link-edit.component.html',
  styleUrls: ['./link-edit.component.scss']
})
export class LinkEditComponent extends SecondPageEditBase implements OnInit {
  modelEdit: any = {};
  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _WmShortCutLinksService: WmShortCutLinksService,
  ) {
    super(null, _injector);
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      link: ['', Validators.required],
    });
  }

  async showPopupLink(id: any, idProject: any) {
    this.isShow = true;
    if (id > 0) {
      await this._WmShortCutLinksService.getDetail(id)
        .then(async response => {
          if (response.status) {
            this.modelEdit = response.data;
          }
        }, () => {
          this._notifierService.showHttpUnknowError();
        });
    } else {
      this.modelEdit = {
        idProject: idProject
      };
    }
  }

  delete() {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._WmShortCutLinksService.Delete(this.modelEdit.id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.isShow = false;
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  save() {
    this._WmShortCutLinksService.Save(this.modelEdit).then(rs => {
      if (rs.status) {
        this.modelEdit = rs.data;
        this.isShow = false;
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

}
