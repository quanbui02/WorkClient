import { Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { WmTasksService } from '../services/WmTasks.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { WmProjectColsService } from '../services/WmProjectCols.service';
import { UserService } from '../../lib-shared/services/user.service';
import { User } from '../../lib-shared/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { WmProjectMembersService } from '../services/WmProjectMembers.service';
import { CommentComponent } from '../comment/comment.component';
import { LogWorkComponent } from '../log-work/log-work.component';
import { Status } from '../work.enum';
import * as moment from 'moment';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { TaskEditComponent } from '../task-edit/task-edit.component';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent extends SecondPageIndexBase implements OnInit {
  idParent?: number;
  idProject?: number;
  idTask?: number;
  @Input() myTask: boolean
  searchModel: any = {
    key: '',
  };

  modelEdit: any = {
    name: "",
    startDate: '',
    endDate: '',
    completedDate: '',
    type: 1,
    priority: 3,
    percent: 0,
    idProjectCol: 0,
  };
  startDate: Date;
  endDate: Date;
  participant: any[] = [];
  nameTask: string = "";
  typeTask: number = 1;
  listItemNumberPerPageCustom = [10, 20, 50, 100];
  limit_unfinished = 10;
  page_unfinished = 1;
  total_unfinished: number;
  limit_finished = 10;
  page_finished = 1;
  total_finished: number;
  dataSourceFinish = [];
  formGroup: FormGroup = new FormGroup({});
  vi: any;
  status_options: any[] = [];
  statusEdit_options: any[] = [];
  priority_options: any[] = [];
  type_options: any[] = [];
  priorityEdit_options: any[] = [];
  typeEdit_options: any[] = [];
  project_options: any[] = [];
  star_options: any[] = [];
  users_options: any[] = [];
  activeUser: boolean[] = [];
  filterUser: any[] = [];
  curDate = new Date();

  crrUser: User;

  activityType: number = 1;
  itemSelected: number = 0;
  screenOverLay: number = 0;
  isEdit = false;
  isAdd = false;
  isSearch = false;
  isShowDetail = false;

  statusType: any = Status;
  isWorkFolow: any;
  ref: DynamicDialogRef;

  @ViewChild(CommentComponent) _CommentComponent: CommentComponent;
  @ViewChild(LogWorkComponent) _LogWorkComponent: LogWorkComponent;

  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private router: Router,
    private _configurationService: ConfigurationService,
    private _WmTasksService: WmTasksService,
    private _WmProjectColsService: WmProjectColsService,
    private _UserService: UserService,
    private _WmProjectMembersService: WmProjectMembersService,
    private activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
  ) {
    super(null, _injector);
    this.formGroup = this.formBuilder.group({
      name: [''],
      detail: [''],
      endDate: [''],
      completedDate: [''],
      startDate: [''],
      percent: [''],
      priority: [''],
      idProjectCol: [''],
      idSprint: [''],
      attachment: [''],
      type: [''],
      project: [''],
      idAssignee: [''],
      participant: ['']
    });
  }

  async ngOnInit() {
    this.vi = this._configurationService.calendarVietnamese;
    this.curDate = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), this.curDate.getDate());

    this.crrUser = await this._UserService.getCurrentUser();
    this.getPriorityOption();
    this.getTypeOption();
    this.getStarOption();

    this.activatedRoute.params.subscribe(async params => {
      // this.isWorkFolow = JSON.parse(localStorage.getItem("project"));

      if (this.router.url.includes("my-task"))
        this.myTask = true;
      this.isShowDetail = false;
      this.idProject = parseInt(params['id']);
      this.idParent = parseInt(params['idParent']);
      this.idTask = parseInt(params['idTask']);
      await this.GetsByIdProject();
      await this.getData();
      await this.getDataFinish();
      await this.ChangeProjectCols(this.idProject, 1);
      await this.ChangeProjectCols(this.idProject, 0);

      if (this.idTask > 0)
        this.showPopupTask(this.idTask, 0)
    });
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
      this.searchModel.key,
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

  getPriorityOption() {
    this.priority_options = [{ label: 'Chọn độ ưu tiên', value: 0 }];
    this.priority_options.push({ label: 'Rất cao', value: 5 });
    this.priority_options.push({ label: 'Cao', value: 4 });
    this.priority_options.push({ label: 'Trung bình', value: 3 });
    this.priority_options.push({ label: 'Thấp', value: 2 });
    this.priority_options.push({ label: 'Rất thấp', value: 1 });

    this.priorityEdit_options = Array.from(this.priority_options);
    this.priorityEdit_options.shift();
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

    this.typeEdit_options = Array.from(this.type_options);
    this.typeEdit_options.shift();
  }

  async ChangeProjectCols(idProject, type) {
    // type = 0 là cho bộ lọc (status_options)    
    if (type == 0) {
      this.status_options = [];
      this.status_options = [{ label: 'Thiết lập', value: 0 }];
    }
    else {
      // type = 1 là cho phần chi tiết công việc (statusEdit_options)
      this.statusEdit_options = [];
    }

    await this._WmProjectColsService.Gets('', idProject, 0, 100, '', true).then(rs => {
      if (rs.status) {
        if (type == 0) {
          rs.data.forEach(value => {
            this.status_options.push({ label: value.name, value: value.id });
          });
        }
        else {
          this.modelEdit.idProjectCol = null;
          rs.data.forEach(value => {
            this.statusEdit_options.push({ label: value.name, value: value.id });
          });
        }

      }
    });
  }

  async getData() {
    this.isLoading = true;
    this.isAsc = true;
    let UserId = this.myTask ? this.crrUser.userId : null;
    this.sortField = "sort";
    await this._WmTasksService.Gets(
      this.searchModel.key,
      this.convertArrayToString(this.filterUser),
      UserId,
      null,
      false,
      this.idProject,
      this.searchModel.star,
      this.searchModel.type,
      this.searchModel.priority,
      this.searchModel.idProjectCol,
      (this.page_unfinished - 1) * this.limit_unfinished,
      this.limit_unfinished,
      this.sortField,
      false
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        this.dataSource.forEach(value => {
          value.completedDate = value.completedDate ? new Date(value.completedDate) : null;
          value.endDate = value.endDate ? new Date(value.endDate) : null;
          value.startDate = value.startDate ? new Date(value.startDate) : null;
        });
        this.total_unfinished = rs.totalRecord;
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }

  async getDataFinish() {
    this.isLoading = true;
    this.isAsc = false;
    this.sortField = "completedDate";
    let UserId = this.myTask ? this.crrUser.userId : null;
    await this._WmTasksService.Gets(
      this.searchModel.key,
      this.convertArrayToString(this.filterUser),
      UserId,
      null,
      true,
      this.idProject,
      this.searchModel.star,
      this.searchModel.type,
      this.searchModel.priority,
      this.searchModel.idProjectCol,
      (this.page_finished - 1) * this.limit_finished,
      this.limit_finished,
      this.sortField,
      false
    ).then(rs => {
      if (rs.status) {
        this.dataSourceFinish = rs.data;
        this.dataSourceFinish.forEach(value => {
          value.completedDate = value.completedDate ? new Date(value.completedDate) : null;
          value.endDate = value.endDate ? new Date(value.endDate) : null;
          value.startDate = value.startDate ? new Date(value.startDate) : null;
        });
        this.total_finished = rs.totalRecord;
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }

  async getDetail(obj) {
    this.isShowDetail = true;

    if (obj.id != this.modelEdit.id) {
      this.itemSelected = obj.id;

      // Nếu là mytask thì phải tự load người dùng của từng dự án
      if (this.myTask && obj.idProject > 0) {
        this.idProject = obj.idProject;
        await this.GetsByIdProject();
        await this.ChangeProjectCols(this.idProject, 1);
      }

      await this._WmTasksService.GetDetail(obj.id).then(rs => {
        if (rs.status) {
          this.modelEdit = rs.data;
          this.modelEdit.completedDate = this.modelEdit.completedDate ? new Date(this.modelEdit.completedDate) : null;
          this.startDate = this.modelEdit.startDate ? new Date(this.modelEdit.startDate) : null;
          this.endDate = this.modelEdit.endDate ? new Date(this.modelEdit.endDate) : null;
          this.modelEdit.priority = this.modelEdit.priority > 0 ? this.modelEdit.priority : 3;
          this.modelEdit.percent = this.modelEdit.percent > 0 ? this.modelEdit.percent : 0;
          this.modelEdit.type = this.modelEdit.type > 0 ? this.modelEdit.type : 1;

          this.participant = [];
          this.modelEdit.wmParticipants.forEach(value => {
            this.participant.push(value.userId);
          });

          this.isEdit = false;
          // Nếu tab comment đang được chọn thì show comment
          if (this.activityType == 1)
            this._CommentComponent.showData(obj.id);

          // Nếu tab log đang được chọn thì show log
          if (this.activityType == 2)
            this._LogWorkComponent.showData(this.modelEdit.id, this.idProject, this.myTask); // show log
        }
      });
    }
  }

  getDetailZoom() {
    //this.popupEdit.showPopupTask(id, idStatus);
    if (this.modelEdit.id > 0) {
      this.ref = this.dialogService.open(TaskEditComponent, {
        data: {
          id: this.modelEdit.id,
          idProjectCol: this.modelEdit.idProjectCol,
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
          this.modelEdit = re;
          this.onUpdateData(this.modelEdit.id, this.modelEdit.idProject, 1);
          this.isEdit = false;
        }
      });
    }
  }

  async drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);

    if (event.previousIndex != event.currentIndex) {
      let obj = this.dataSource[event.currentIndex]
      let sort = 0;
      let type = 0;
      let objSort = {
        id: 0,
        sort: 0
      };
      if (event.currentIndex == 0) {
        objSort = this.dataSource[event.currentIndex + 1]
        type = 1;
        sort = objSort.sort / 2;
      }
      else if (event.currentIndex == this.dataSource.length - 1) {
        objSort = this.dataSource[event.currentIndex - 1]
        type = 2;
        sort = objSort.sort / 2;
      }
      else {
        let objAfter = this.dataSource[event.currentIndex + 1]
        let objBefore = this.dataSource[event.currentIndex - 1]
        sort = (objBefore.sort + objAfter.sort) / 2;
      }
      await this._WmTasksService.ChangeSortRow(obj.id, sort, objSort.id, type).then(rs => {
        if (rs.status) {

        }
      });
    }
  }

  async dropFinish(event: CdkDragDrop<any>) {
    moveItemInArray(this.dataSourceFinish, event.previousIndex, event.currentIndex);

    if (event.previousIndex != event.currentIndex) {
      let obj = this.dataSourceFinish[event.currentIndex]
      let sort = 0;
      let type = 0;
      let objSort = {
        id: 0,
        sort: 0
      };
      if (event.currentIndex == 0) {
        objSort = this.dataSourceFinish[event.currentIndex + 1]
        type = 1;
      }
      else if (event.currentIndex == this.dataSource.length - 1) {
        objSort = this.dataSourceFinish[event.currentIndex - 1]
        type = 2;
      }
      else {
        let objAfter = this.dataSourceFinish[event.currentIndex + 1]
        let objBefore = this.dataSourceFinish[event.currentIndex - 1]
        sort = (objBefore.sort + objAfter.sort) / 2;
      }
      await this._WmTasksService.ChangeSortRow(obj.id, sort, objSort.id, type, this.searchModel.idProject, this.searchModel.idProjectCol).then(rs => {
        if (rs.status) {

        }
      });
    }
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._WmTasksService.delete(id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.dataSource = this.dataSource.filter(obj => obj.id !== id);
          this.dataSourceFinish = this.dataSourceFinish.filter(obj => obj.id !== id);
          this.modelEdit = {
            name: "",
            startDate: '',
            endDate: '',
            completedDate: '',
            type: 1,
            priority: 3,
            percent: 0,
            idProjectCol: 0,
          };
          this.isShowDetail = false;
        }
        else
          this._notifierService.showError(re.message);
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  async onCreated() {
    this.modelEdit = {
      name: this.nameTask,
      type: this.typeTask,
      idProject: this.idProject,
      idProjectCol: this.searchModel.idProjectCol == 0 ? null : this.searchModel.idProjectCol,
      percent: 0,
      priority: 3,
    }
    this.startDate = null;
    this.endDate = null;
    this.participant = [];
    this.nameTask = "";
    await this._WmTasksService.post(this.modelEdit).then(async rs => {
      if (rs.status) {
        this.onUpdateData(rs.data.id, rs.data.idProject, 0);
        this.isShowDetail = true;

        // Nếu tab comment đang được chọn thì show comment
        if (this.activityType == 1)
          this._CommentComponent.showData(rs.data.id);

        // Nếu tab log đang được chọn thì show log
        if (this.activityType == 2)
          this._LogWorkComponent.showData(this.modelEdit.id, this.idProject, this.myTask); // show log
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

  async onSave() {
    this.modelEdit.wmParticipants = [];
    this.participant.forEach(x => {
      this.modelEdit.wmParticipants.push({
        Id: 0,
        UserId: x,
        IdTask: this.modelEdit.id
      });
    });
    this.modelEdit.completed = this.modelEdit.percent == 100 ? true : false;

    if (this.startDate)
      this.modelEdit.startDate = moment(this.startDate).format('YYYY-MM-DD HH:mm');

    if (this.endDate)
      this.modelEdit.endDate = moment(this.endDate).format('YYYY-MM-DD HH:mm');

    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this._notifierService.showError("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
      return false;
    }

    await this._WmTasksService.post(this.modelEdit).then(async rs => {
      if (rs.status) {
        this.modelEdit = rs.data;
        this.onUpdateData(this.modelEdit.id, this.modelEdit.idProject, 1);
        this.isEdit = false;
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

  // type = 0: tạo mới, type = 1: sửa
  async onUpdateData(id, idProject, type) {
    await this._WmTasksService.Gets('', "", null, id, null, idProject, null, null, null, null, 0, 1, '', false).then(rs => {
      if (rs.status && rs.data.length > 0) {
        let obj = rs.data[0];

        obj.completedDate = obj.completedDate ? new Date(obj.completedDate) : null;
        obj.endDate = obj.endDate ? new Date(obj.endDate) : null;
        obj.startDate = obj.startDate ? new Date(obj.startDate) : null;

        if (!obj.completed) {
          const index = this.dataSource.findIndex(s => s.id === obj.id);
          const indexFn = this.dataSourceFinish.findIndex(s => s.id === obj.id);
          if (index >= 0) {
            this.dataSource[index] = obj;
          } else {
            this.dataSource.splice(0, 0, obj);
          }

          if (indexFn >= 0) {
            this.dataSourceFinish.splice(indexFn, 1);
          }
        }
        else {
          const indexFn = this.dataSourceFinish.findIndex(s => s.id === obj.id);
          const index = this.dataSource.findIndex(s => s.id === obj.id);
          if (indexFn >= 0) {
            this.dataSourceFinish[indexFn] = obj;
          } else {
            this.dataSourceFinish.splice(0, 0, obj);
          }

          if (index >= 0) {
            this.dataSource.splice(index, 1);
          }
        }

        // khi tạo mới thì em set data vào modelEdit và percent bằng 0, do là nó sẽ mở phần chi tiết ngay khi tạo mới
        if (type == 0) {
          this.modelEdit = obj;
          this.modelEdit.percent = 0;
        }
      }
    });
  }

  async onChangeComplete(id) {
    await this._WmTasksService.ChangeComplete(id).then(rs => {
      if (rs.status) {
        if (rs.data.completed) {
          let index = this.dataSource.findIndex(x => x.id == id);
          let data = this.dataSource[index];
          data.completed = true;
          data.idStatus = rs.data.idStatus;
          this.dataSource.splice(index, 1);
          this.dataSourceFinish.unshift(data);
        }
        else {
          let index = this.dataSourceFinish.findIndex(x => x.id == id);
          let data = this.dataSourceFinish[index];
          data.completed = false;
          data.idStatus = rs.data.idStatus;
          this.dataSourceFinish.splice(index, 1);
          this.dataSource.push(data);
        }
      }
    });
  }

  async onChangeStar(id) {
    await this._WmTasksService.ChangeStar(id).then(rs => {
      if (rs.status) {
        if (rs.data.completed) {
          let index = this.dataSourceFinish.findIndex(s => s.id == id);
          this.dataSourceFinish[index].star = rs.data.star;
        }
        else {
          let index = this.dataSource.findIndex(s => s.id == id);
          this.dataSource[index].star = rs.data.star;
        }
      }
    });
  }

  paginateUnfinished(event) {
    this.page_unfinished = event.page + 1;
    this.limit_unfinished = event.rows;
    this.getData();
  }

  paginateFinished(event) {
    this.page_finished = event.page + 1;
    this.limit_finished = event.rows;
    this.getDataFinish();
  }

  getAvatar(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/avatar.jpg`;
  }

  getAvatarProject(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/rocket.svg`;
  }

  onSearchCustom(): void {
    this.page_finished = 1;
    this.page_unfinished = 1;

    this.getData();
    this.getDataFinish();
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
    this.getData();
    this.getDataFinish();
  }

  getUserNameById(id) {
    let dataUser = this.users_options.filter(x => x.value == id)[0];
    if (dataUser) return dataUser.label;
    else return "";
  }

  getAvatarById(id) {
    let dataUser = this.users_options.filter(x => x.value == id)[0];
    if (dataUser && dataUser.avatar != null)
      return this.getImageAvatar(dataUser.avatar);
    else
      return `/assets/images/avatar.jpg`;
  }

  getStatusTask(idProjectCol) {
    let data = this.statusEdit_options.filter(x => x.value == idProjectCol)[0];
    return data ? data.label : '';
  }

  openSearchName() {
    this.isSearch = !this.isSearch;
    let input = document.getElementById("input_search_name");
    input.focus();
  }

  hideShowInputTask() {
    this.isAdd = !this.isAdd;
    let inputTask = document.getElementById("input_task");
    if (this.isAdd) inputTask.focus();
  }
  closeCreate() {
    this.isAdd = !this.isAdd;
  }
  convertArrayToString(listItem: any[]) {
    let stringItem = "";
    for (let i = 0; i < listItem.length; i++) {
      if (i == listItem.length - 1)
        stringItem += `${listItem[i]}`
      else
        stringItem += `${listItem[i]},`
    }
    return stringItem;
  }
  CheckDayExpirationSoon(dateTask: Date) {
    if (dateTask) {
      dateTask = new Date(dateTask);
      let date = new Date(dateTask.getFullYear(), dateTask.getMonth(), dateTask.getDate());
      if (date.getTime() - this.curDate.getTime() <= 86400000 && date.getTime() - this.curDate.getTime() >= 0) {
        return true
      }
    }
    return false
  }
  // showAvtivity(acivityType) {
  //   this.activityType = acivityType;
  //   if (this.activityType == 1)
  //     this._CommentComponent.showData(this.modelEdit.id);

  //   // Nếu tab log đang được chọn thì show log
  //   if (this.activityType == 2)
  //     this._LogWorkComponent.showData(this.modelEdit.id, this.idProject, this.myTask); // show log
  // }
}
