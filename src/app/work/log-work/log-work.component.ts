import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { WmLogWorksService } from '../services/WmLogWorks.service';
import { LogActions, Status } from '../work.enum';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { TaskViewComponent } from '../task-view/task-view.component';

@Component({
  selector: 'app-log-work',
  templateUrl: './log-work.component.html',
  styleUrls: ['./log-work.component.scss']
})
export class LogWorkComponent extends SecondPageIndexBase implements OnInit {
  @Input() idTask?: number;
  @Input() idProject: number;
  @Input() myTask: boolean;

  searchModel: any = {
    key: '',
    isActive: null,
    isDelete: false
  };

  logActions = LogActions;
  Status = Status;
  ref: DynamicDialogRef;
  showPopup: boolean[] = [];

  constructor(
    protected _injector: Injector,
    private _WmLogWorks: WmLogWorksService,
    public dialogService: DialogService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    await this.getData();
  }

  async showData(idTask, idProject, myTask) {
    this.idTask = idTask;
    this.idProject = idProject;
    this.myTask = myTask;
    await this.getData();
  }

  async getData() {
    this.isLoading = true;
    await this._WmLogWorks.Gets(
      this.idProject,
      this.idTask,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
      this.isAsc
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        this.total = rs.totalRecord;

        // for (let i = 0; i < this.total; i++) {
        //   this.showPopup[i] = false;
        // }
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }

  onSearch() {
    this.getData();
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._WmLogWorks.delete(id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.dataSource = this.dataSource.filter(x => x.id !== id)
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  showTaskView(id) {
    this.ref = this.dialogService.open(TaskViewComponent, {
      data: {
        id: id,
        idProject: this.idProject
      },
      showHeader: false,
      header: '',
      width: '95%',
      height: 'calc(100vh - 50px)',
      styleClass: "vs-modal",
      contentStyle: { 'overflow': 'auto' }, //'max-height': 'calc(100vh - 180px);', 
      baseZIndex: 1001,
      closeOnEscape: true
    });

    this.ref.onClose.subscribe((re: any) => {
      if (re != null) {
        this.isLoading = false;
      }
    });

  }

  getAvatar(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/rocket.svg`;
  }
  getAvatarUser(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/avatar.jpg`;
  }
}
