
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { WmProjectColsService } from '../../services/WmProjectCols.service';
import { WmProjectsService } from '../../services/WmProjects.service';
import { debug } from 'console';


@Component({
  selector: 'app-project-cols-edit',
  templateUrl: './project-cols-edit.component.html',
  styleUrls: ['./project-cols-edit.component.scss']
})
export class ProjectColsEditComponent extends SecondPageEditBase
  implements OnInit {
  @Input() idParent?: number;
  @Input() idProject?: number;
  isLoading = false;
  modelEdit: any = {
    idProject: 0
  };
  project_options: any[] = [];
  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _WmProjectColsService: WmProjectColsService,
    private _WmProjectsService: WmProjectsService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      description: [''],
      name: ['', Validators.required],
      image: [''],
      isActived: [''],
      idSprint: [''],
      idProject: ['', Validators.required]
    });
    await this.getProjectsOption();
    // await this.changeProject(this.idProject);
  }


  async getProjectsOption() {
    this.project_options = [{ label: 'Chọn dự án', value: 0 }];
    await this._WmProjectsService.Gets('', false, true, false, 0, 100, '', true).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.project_options.push({ label: value.name, value: value.id });
        });
      }
    });
  }

  save() {
    this._WmProjectColsService.Save(this.modelEdit).then(rs => {
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

  async showPopupEdit(id: any) {
    this.isShow = true;
    if (id > 0) {
      await this._WmProjectColsService.getDetail(id)
        .then(async response => {
          if (response.status) {
            this.modelEdit = response.data;
          }
        }, () => {
          this._notifierService.showHttpUnknowError();
        });
    } else {
      this.modelEdit = {
        isActived: true,
        idProject: this.idProject == 0 ? null : this.idProject,
      };
    }
  }

}