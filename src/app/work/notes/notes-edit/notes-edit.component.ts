import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { WmNoteService } from '../../services/WmNote.service';
import { async } from '@angular/core/testing';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/primeng';

@Component({
  selector: 'app-notes-edit',
  templateUrl: './notes-edit.component.html',
  styleUrls: ['./notes-edit.component.scss']
})
export class NotesEditComponent extends SecondPageEditBase implements OnInit {

  modelEdit: any = {
    name: "",
    detail: ""
  }

  isEdit = false;

  constructor(
    protected _injector: Injector,
    private _WmNoteService: WmNoteService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    await this.GetDetail(this.config.data.id)
  }

  async onSave() {
    await this._WmNoteService.Save(this.modelEdit).then(rs => {
      if (rs.status) {
        this.modelEdit = rs.data;
        // this._notifierService.showSuccess('Cập nhật thành công');
        // this.ref.close(rs.data);
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

  async GetDetail(id: any) {
    if (id > 0) {
      await this._WmNoteService.GetDetail(id).then(async response => {
        if (response.status) {
          this.modelEdit = response.data;
        }
      }, () => {
        this._notifierService.showHttpUnknowError();
      });
    } else {
      this.modelEdit = {
        name: "",
        detail: ""
      }
    }
  }

  async closePopupMethod() {
    await this.onSave();
    this.ref.close(this.modelEdit);
  }
}
