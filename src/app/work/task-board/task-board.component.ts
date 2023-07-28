
import { Component, OnInit, Input, Injector, ViewChild } from "@angular/core";
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { WmTasksService } from '../services/WmTasks.service';
import { WmProjectsService } from '../services/WmProjects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WmProjectColsService } from '../services/WmProjectCols.service';
import { WmProjectMembersService } from '../services/WmProjectMembers.service';
import { EventEmitterService } from '../../services/eventemitter.service';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { TaskEditComponent } from '../task-edit/task-edit.component';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent extends SecondPageIndexBase implements OnInit {
  @Input() myTask: boolean;
  idParent?: number = 0;
  idProject?: number = 0;
  idTask?: number = 0;
  searchModel: any = {
    key: '',

  };
  status_options: any[];
  priority_options: any[];
  type_options: any[];
  project_options: any[];
  star_options: any[];
  isWorkFolow = false;
  isSearch = false;
  dataTasks = [];
  users_options: any[] = [];
  activeUser: boolean[] = [];
  filterUser: any[] = [];
  ref: DynamicDialogRef;

  constructor(
    protected _injector: Injector,
    private router: Router,
    private _WmTasksService: WmTasksService,
    private _WmProjectsService: WmProjectsService,
    private _WmProjectColsService: WmProjectColsService,
    private activatedRoute: ActivatedRoute,
    private _WmProjectMembersService: WmProjectMembersService,
    private eventEmitterService: EventEmitterService,
    public dialogService: DialogService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    await this.activatedRoute.params.subscribe(async params => {
      this.idProject = params['id'] == undefined ? 0 : parseInt(params['id']);
      this.idParent = params['idParent'] == undefined ? 0 : parseInt(params['idParent']);
      this.idTask = params['idTask'] == undefined ? 0 : parseInt(params['idTask']);

      await this.GetDataTasks();
      await this.GetProjectCols();

      if (this.idTask > 0)
        this.showPopupTask(this.idTask, 0)
    });
    // await this.getProjectsOption();
    await this.GetsByIdProject();
    this.getPriorityOption();
    this.getTypeOption();
    this.getStarOption();
    this.openSearchAdv = true;

    if (this.idProject)
      this.getProject(this.idProject);
  }

  showPopupTask(id, idProjectCol) {
    //this.popupEdit.showPopupTask(id, idStatus);
    this.ref = this.dialogService.open(TaskEditComponent, {
      data: {
        id: id,
        idProjectCol: idProjectCol,
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
        //this.changeData.emit(this.createdIssue);
      }
    });
  }

  async GetsByIdProject() {
    this.users_options = [];
    await this._WmProjectMembersService.GetsByIdProject(
      "",
      this.idProject,
      0,
      1000
    ).then(rs => {
      if (rs.status) {
        for (let i = 0; i < rs.data.length; i++) {
          this.users_options.push({ label: rs.data[i].name, value: rs.data[i].userId, avatar: rs.data[i].avatar });
          this.activeUser[i] = false;
        }
      }
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

  getPriorityOption() {
    this.priority_options = [{ label: 'Chọn độ ưu tiên', value: 0 }];
    this.priority_options.push({ label: 'Rất cao', value: 5 });
    this.priority_options.push({ label: 'Cao', value: 4 });
    this.priority_options.push({ label: 'Trung bình', value: 3 });
    this.priority_options.push({ label: 'Thấp', value: 2 });
    this.priority_options.push({ label: 'Rất thấp', value: 1 });
  }

  getStarOption() {
    this.star_options = [{ label: 'Chọn đánh dấu', value: null }];
    this.star_options.push({ label: 'Có', value: true });
    this.star_options.push({ label: 'Không', value: false });
  }

  getTypeOption() {
    this.type_options = [{ label: 'Chọn loại công việc', value: 0 }];
    this.type_options.push({ label: 'Task', value: 1 });
    this.type_options.push({ label: 'Bug', value: 2 });
  }

  async GetProjectCols() {
    // this.dataSource = [];
    await this._WmProjectColsService.Gets('', this.idProject, 0, 100, '', true).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        this.dataSource.forEach(item => {
          item.wmTasks = this.dataTasks.filter(s => s.idProjectCol == item.id).sort(function (x, y) { return y.sortColumn - x.sortColumn })
        });
      }
    });
  }

  async GetDataTasks() {
    this.isLoading = true;
    this.isAsc = true;
    await this._WmTasksService.Gets(
      this.searchModel.key,
      this.convertArrayToString(this.filterUser),
      null,
      null,
      null,
      this.idProject,
      this.searchModel.star,
      this.searchModel.type,
      this.searchModel.priority,
      this.searchModel.idProjectCol,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
      false
    ).then(rs => {
      if (rs.status) {
        this.dataTasks = rs.data;
        this.dataTasks.forEach(value => {
          value.completedDate = value.completedDate ? new Date(value.completedDate) : null;
          value.endDate = value.endDate ? new Date(value.endDate) : null;
          value.startDate = value.startDate ? new Date(value.startDate) : null;
        });
        this.total = rs.totalRecord;
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }

  filterMemberProject(index, id) {
    this.activeUser[index] = !this.activeUser[index];
    if (this.activeUser[index]) {
      this.filterUser.push(id);
    }
    else {
      let indexData = this.filterUser.findIndex(s => s == id);
      this.filterUser.splice(indexData, 1);
    }
    this.GetDataTasks().then(x => {
      this.dataSource.forEach(item => {
        item.wmTasks = this.dataTasks.filter(s => s.idProjectCol == item.id).sort(function (x, y) { return y.sortColumn - x.sortColumn })
      });
    });
  }

  getAvatar(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/avatar.jpg`;
  }

  buildUrl(url: string) {
    if (this.router.url.includes("my-task"))
      return url.replace("group-task", "my-task");

    return `${url}/${this.idParent}/${this.idProject}`;
  }

  openSearchName() {
    this.isSearch = true;
    let input = document.getElementById("input_search_name");
    input.focus();
  }

  async onCloseForm() {
    await this.GetDataTasks();
    this.dataSource.forEach(item => {
      item.wmTasks = this.dataTasks.filter(s => s.idProjectCol == item.id).sort(function (x, y) { return y.sortColumn - x.sortColumn })
    });
  }

  checkHide(index) {
    if (this.isWorkFolow) {
      if (index == 0) return true;
      return false;
    }
    else {
      return true;
    }
  }

  async changeData(data) {
    await this.GetDataTasks();
    this.dataSource.forEach(item => {
      item.wmTasks = this.dataTasks.filter(s => s.idProjectCol == item.id).sort(function (x, y) { return y.sortColumn - x.sortColumn })
    });
  }

  getAvatarById(id) {
    let dataUser = this.users_options.filter(x => x.value == id)[0];
    if (dataUser && dataUser.avatar != null)
      return this.getImageAvatar(dataUser.avatar);
    else
      return `/assets/images/avatar.jpg`;
  }

  convertArrayToString(listItem: any[]) {
    let stringItem = "";
    for (let i = 0; i < listItem.length; i++) {
      if (i == listItem.length - 1) {
        stringItem += `${listItem[i]}`
      }
      else {
        stringItem += `${listItem[i]},`
      }
    }
    return stringItem;
  }

  async onSearch() {
    await this.GetDataTasks();
    await this.GetProjectCols();
  }
}
