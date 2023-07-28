import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { WmProjectColsService } from '../services/WmProjectCols.service';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ProjectColsEditComponent } from './status-edit/project-cols-edit.component';
import { ActivatedRoute } from '@angular/router';
import { WmProjectsService } from '../services/WmProjects.service';
import { async } from '@angular/core/testing';
import { DeleteProjectColsComponent } from './delete-project-cols/delete-project-cols.component';

@Component({
  selector: 'app-project-cols',
  templateUrl: './project-cols.component.html',
  styleUrls: ['./project-cols.component.scss']
})
export class ProjectColsComponent extends SecondPageIndexBase implements OnInit {
  @ViewChild(ProjectColsEditComponent) _ProjectColsEditComponent: ProjectColsEditComponent;
  @ViewChild(DeleteProjectColsComponent) _DeleteProjectColsComponent: DeleteProjectColsComponent;
  idParent?: number;
  idProject?: number;
  searchModel: any = {
    key: '',
    idSprint: null
  };
  modelEdit: any = {
    name: '',
    idStatus: 2
  }
  status_options: any[] = [];
  isWorkFolow = false;
  isEdit = false;
  isEditDesc: boolean[] = [];
  isEditName: boolean[] = [];

  constructor(
    protected _injector: Injector,
    private _WmProjectColsService: WmProjectColsService,
    private activatedRoute: ActivatedRoute,
    private _WmProjectsService: WmProjectsService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    await this.activatedRoute.params.subscribe(async params => {
      // debugger;
      this.idProject = parseInt(params['id']);
      this.idParent = parseInt(params['idParent']);

      await this.getData();
      this.setWidthBoard();
      this.getStatusOption();
      if (this.idProject)
        this.getProject(this.idProject);
    });
  }

  async getProject(idProject) {
    await this._WmProjectsService.getDetail(idProject)
      .then(async response => {
        if (response.status) {
          this.isWorkFolow = response.data.isWorkFolow;
        }
      }, () => {
        this._notifierService.showHttpUnknowError();
      });
  }

  getStatusOption() {
    this.status_options.push({ label: 'To-Do', value: 1 });
    this.status_options.push({ label: 'In-Progress', value: 2 });
    this.status_options.push({ label: 'Done', value: 3 });
  }

  async getData() {
    await this._WmProjectColsService.Gets(
      '',
      this.idProject == 0 ? null : this.idProject,
      0, 100, '', true).then(rs => {
        if (rs.status) {
          this.dataSource = rs.data;
          this.total = rs.totalRecord;

          for (let i = 0; i < this.dataSource.length; i++) {
            this.isEditDesc[i] = false;
            this.isEditName[i] = false;
          }
        }
      });
  }
  async drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);

    if (event.previousIndex != event.currentIndex) {
      let obj = this.dataSource[event.currentIndex]
      let sort = 0;
      let objSort = {
        id: 0,
        sort: 0
      };
      if (event.currentIndex == 0) {
        objSort = this.dataSource[event.currentIndex + 1]
        sort = objSort.sort - 16384;
      }
      else if (event.currentIndex == this.dataSource.length - 1) {
        objSort = this.dataSource[event.currentIndex - 1]
        sort = objSort.sort + 16384;
      }
      else {
        let objAfter = this.dataSource[event.currentIndex + 1]
        let objBefore = this.dataSource[event.currentIndex - 1]
        sort = (objBefore.sort + objAfter.sort) / 2;
      }
      await this._WmProjectColsService.ChangeSort(obj.id, sort).then(rs => {
        if (rs.status) {

        }
      });
    }
  }

  async save(index) {
    if (this.modelEdit.name.trim().length > 0) {
      this.modelEdit.idProject = this.idProject == 0 ? null : this.idProject;
      this.modelEdit.idStatus = this.isWorkFolow ? this.modelEdit.idStatus : null;
      await this._WmProjectColsService.Save(this.modelEdit).then(rs => {
        if (rs.status) {
          let indexData = this.dataSource.findIndex(x => x.id == rs.data.id);
          if (indexData >= 0) this.dataSource[indexData] = { ...rs.data, countTask: this.dataSource[indexData].countTask };
          else this.dataSource.push({ ...rs.data, countTask: 0 });

          this.isEdit = false;
          this.setWidthBoard();
          this.modelEdit = {
            name: '',
            idStatus: 2
          }
        }
      });
    }

    if (index >= 0) {
      this.isEditName[index] = false;
      this.isEditDesc[index] = false;
    }
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._WmProjectColsService.ChangeDelete(id, 0).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.dataSource = this.dataSource.filter(obj => obj.id !== id);

          // let boardInfo = document.getElementById('board_status_info');
          let boardStatus = document.getElementById('board_status');
          boardStatus.style.width = (this.dataSource.length * 275 + 60 + 35) + 'px';
          // boardInfo.style.width = (this.dataSource.length * 275 + 60 + 35) + 'px';
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  setWidthBoard() {
    let boardStatus = document.getElementById('board_status');
    // let boardInfo = document.getElementById('board_status_info');
    if ((boardStatus.offsetWidth - (this.dataSource.length * 275 + 60 + 35)) < 10) {
      boardStatus.style.width = (this.dataSource.length * 275 + 60 + 35) + 'px';
      // boardInfo.style.width = (this.dataSource.length * 275 + 60 + 35) + 'px';
    }
    // boardStatus.style.width = (bodyBoard.offsetHeight - boardTaskInfo.offsetHeight - 50) + 'px';
  }

  openInputSave() {
    this.isEdit = true;
    // let boardInfo = document.getElementById('board_status_info');
    let boardStatus = document.getElementById('board_status');
    let bodyBoard = document.getElementById('body_board');
    // let input_board = document.getElementById('input_board');
    // let inputTextBoard = document.getElementById('input_text_board');
    // inputTextBoard.focus();

    if ((boardStatus.offsetWidth - ((this.dataSource.length + 1) * 275 + 60 + 35)) < 10) {
      boardStatus.style.width = ((this.dataSource.length + 1) * 275 + 60 + 35) + 'px';
      // boardInfo.style.width = ((this.dataSource.length + 1) * 275 + 60 + 35) + 'px';
      bodyBoard.scrollLeft = bodyBoard.offsetWidth;
    }

    this.modelEdit = {
      name: "",
      idStatus: 2,
      description: ""
    }
  }

  async onEdit(id: any) {
    await this._ProjectColsEditComponent.showPopupEdit(id);
  }

  async onDeletePopup(id) {
    await this._DeleteProjectColsComponent.showPopup(id);
  }

  async onCloseForm() {
    await this.getData();
  }

  async openInputCol(id, index, type) {
    this.isEdit = false;
    if (type == 1) this.isEditName[index] = true;
    if (type == 2) this.isEditDesc[index] = true;
    if (this.modelEdit.id != id) {
      await this._WmProjectColsService.getDetail(id)
        .then(async response => {
          if (response.status) {
            this.modelEdit = response.data;
          }
        }, () => {
          this._notifierService.showHttpUnknowError();
        });
    }
  }
}
