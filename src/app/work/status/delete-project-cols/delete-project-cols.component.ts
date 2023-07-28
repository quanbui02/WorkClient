import { WmProjectColsService } from '../../services/WmProjectCols.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { WmProjectsService } from '../../services/WmProjects.service';


@Component({
  selector: 'app-delete-project-cols',
  templateUrl: './delete-project-cols.component.html',
  styleUrls: ['./delete-project-cols.component.scss']
})
export class DeleteProjectColsComponent extends SecondPageEditBase
  implements OnInit {
  @Input() idProject?: number;
  isLoading = false;
  idProjectCol: number = 0;
  projectCols = {
    id: 0,
    name: "",
    idStatus: 0
  };
  projectCols_options: any[] = [];
  constructor(
    protected _injector: Injector,
    private _WmProjectColsService: WmProjectColsService,
    private _WmProjectsService: WmProjectsService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {

  }


  async getProjectColsOption(idProjectCol) {
    this.projectCols_options = [];
    await this._WmProjectColsService.GetByProjects(this.idProject, idProjectCol).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.projectCols_options.push({ label: value.name, value: value.id, idStatus: value.idStatus });
        });
      }
    });
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._WmProjectColsService.ChangeDelete(id, this.idProjectCol).then(re => {
        if (re.status) {
          this._notifierService.showSuccess('Cập nhật thành công');
          this.isShow = false;
          this.closePopup.emit();
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }
  async showPopup(id: any) {
    this.idProjectCol = 0;
    this.isShow = true;
    await this.getProjectColsOption(id);
    await this._WmProjectColsService.getDetail(id)
      .then(async response => {
        if (response.status) {
          this.projectCols = response.data;
        }
      }, () => {
        this._notifierService.showHttpUnknowError();
      });
    this.idProjectCol = this.projectCols_options[0].value;
    console.log(this.idProjectCol)
  }

}