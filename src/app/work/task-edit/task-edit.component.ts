import { Component, ElementRef, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/primeng';
import { SecondPageEditBase } from '../../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../../lib-shared/services/user.service';
import { WmProjectMembersService } from '../services/WmProjectMembers.service';
import { WmProjectColsService } from '../services/WmProjectCols.service';
import { WmTasksService } from '../services/WmTasks.service';
import { CommentComponent } from '../comment/comment.component';
import { debug } from 'console';
import { LogWorkComponent } from '../log-work/log-work.component';
import * as moment from 'moment';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent extends SecondPageEditBase implements OnInit {
  isLoading = false;
  modelEdit: any = {
    percent: 0,
    type: 1,
    priority: 3,
    user: {
      avatar: null
    }
  };
  crrUser: any = {};
  startDate: Date;
  endDate: Date;
  participant: any[] = [];
  projectCol_options: any[] = [];
  priority_options: any[];
  type_options: any[];
  star_options: any[];
  users_options: any[] = [];

  openDetail: boolean = true;
  openTime: boolean = true;
  activityType: number = 1;
  isEdit = false;
  isWorkFolow: any;

  @ViewChild(CommentComponent) _CommentComponent: CommentComponent;
  @ViewChild(LogWorkComponent) _LogWorkComponent: LogWorkComponent;

  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _WmTasksService: WmTasksService,
    private _WmProjectColsService: WmProjectColsService,
    private _WmProjectMembersService: WmProjectMembersService,
    private _UserService: UserService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    super(null, _injector);
    this.formGroup = this.formBuilder.group({
      name: [''],
      description: [''],
      detail: [''],
      endDate: [''],
      completedDate: [''],
      startDate: [''],
      percent: [''],
      priority: [''],
      idStatus: [''],
      attachment: [''],
      type: [''],
      project: [''],
      idAssignee: [''],
      participant: ['']
    });
  }

  async ngOnInit() {
    this.crrUser = await this._UserService.getCurrentUser();

    this.modelEdit.user = this.crrUser;
    this.modelEdit.idStatus = this.config.data.idStatus == 0 ? null : this.config.data.idStatus
    this.modelEdit.idProject = this.config.data.idProject;

    this.getPriorityOption();
    this.getTypeOption();
    this.getStarOption();
    await this.getProjectColOption();
    await this.GetsByIdProject();
    await this.GetDetail(this.config.data.id)
  }

  async GetsByIdProject() {
    this.users_options = [];
    await this._WmProjectMembersService.GetsByIdProject("", this.config.data.idProject, 0, 1000).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.users_options.push({ label: value.name, value: value.userId, avatar: value.avatar });
        });
      }
    });
  }

  async getProjectColOption() {
    await this._WmProjectColsService.Gets('', this.config.data.idProject, 0, 100, '', true).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.projectCol_options.push({ label: value.name, value: value.id });
        });
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

  getAvatar(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/avatar.jpg`;
  }

  onSave() {
    let lstParticipant = [];
    this.participant.forEach(x => {
      lstParticipant.push({
        Id: 0,
        UserId: x,
        IdTask: this.modelEdit.id
      });
    });
    this.modelEdit.wmParticipants = lstParticipant;
    this.modelEdit.completed = this.modelEdit.percent == 100 ? true : false;

    if (this.startDate)
      this.modelEdit.startDate = moment(this.startDate).format('YYYY-MM-DD HH:mm');

    if (this.endDate)
      this.modelEdit.endDate = moment(this.endDate).format('YYYY-MM-DD HH:mm');

    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this._notifierService.showError("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
      return false;
    }

    this._WmTasksService.Save(this.modelEdit).then(rs => {
      if (rs.status) {
        this.isEdit = false;
        this.modelEdit = { ...rs.data, user: this.modelEdit.user, project: this.modelEdit.project };
        // this._notifierService.showSuccess('Cập nhật thành công');
        // this.ref.close(rs.data);
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

  async GetDetail(id: any) {
    if (id > 0) {
      await this._WmTasksService.GetDetail(id).then(async response => {
        if (response.status) {
          this.modelEdit = response.data;
          this.modelEdit.completedDate = this.modelEdit.completedDate ? new Date(this.modelEdit.completedDate) : null;
          this.endDate = this.modelEdit.endDate ? new Date(this.modelEdit.endDate) : null;
          this.startDate = this.modelEdit.startDate ? new Date(this.modelEdit.startDate) : null;

          this.participant = [];
          this.modelEdit.wmParticipants.forEach(value => {
            this.participant.push(value.userId);
          });

          // Nếu tab comment đang được chọn thì show comment
          if (this.activityType == 1)
            await this._CommentComponent.showData(id);

          // Nếu tab log đang được chọn thì show log
          if (this.activityType == 2)
            await this._LogWorkComponent.showData(this.modelEdit.id, this.modelEdit.idProject, false); // show log
        }
      }, () => {
        this._notifierService.showHttpUnknowError();
      });
    } else {
      let crrUser = await this._UserService.getCurrentUser();
      this.modelEdit = {
        user: crrUser,
        idProjectCol: this.config.data.idProjectCol == 0 ? this.projectCol_options[0].value : this.config.data.idProjectCol,
        idProject: this.config.data.idProject,
        percent: 0,
        type: 1,
        priority: 3
      };
    }
  }

  async onChangeComplete(id) {
    await this._WmTasksService.ChangeComplete(id).then(rs => {
      if (rs.status) {
        this.modelEdit.completed = rs.data.completed;
        this.modelEdit.percent = rs.data.percent;
      }
    });
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._WmTasksService.delete(id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.ref.close(re.data);
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  getMaxDialogHeight() {
    return (window.innerHeight - 200).toString() + 'px';
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

  closePopupMethod() {
    this.ref.close(this.modelEdit);
  }

}