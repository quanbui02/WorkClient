import { Component, Injector, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../lib-shared/services/user.service';
import { WmProjectsService } from '../services/WmProjects.service';
import { ProjectEditComponent } from './project-edit/project-edit.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent extends SecondPageIndexBase implements OnInit {
  @Input() idProject?: number;
  @Output() loadMenuEditProjects = new EventEmitter<any>();
  searchModel: any = {
    key: '',
    isActive: null,
    isDelete: false
  };
  userId: number;
  active_options = [];
  delete_options = [];

  @ViewChild(ProjectEditComponent) _ProjectEditComponent: ProjectEditComponent;

  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    private _WmProjectsService: WmProjectsService,

  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.loadTableColumnConfig();
    await this.getData();

    this.userId = this._userService.getBasicUserInfo().userId;
    await this.loadActiveOptions();
    await this.loadDeleteOptions();
  }

  loadTableColumnConfig() {
    this.cols = [
      {
        field: 'name',
        header: 'Tên',
        align: 'left',
        visible: true,
        sort: false
      },
      {
        field: 'description',
        header: 'Mô tả',
        align: 'left',
        visible: true,
        width: '400px',
        sort: false
      },
      {
        field: 'userCreated',
        header: 'Người tạo',
        visible: true,
        sort: false,
        width: '300px',
        align: 'center'
      },
      {
        field: 'createdDate',
        header: 'Ngày tạo',
        visible: true,
        align: 'center',
        sort: false,
        width: '150px'
      },
      {
        field: 'sort',
        header: 'Thứ tự',
        visible: true,
        sort: false,
        width: '50px',
        align: 'center'
      },
      {
        field: 'isWorkFolow',
        header: 'Quy trình',
        visible: true,
        sort: false,
        width: '150px',
        align: 'center'
      },
      {
        field: 'isActived',
        header: 'Trạng thái hoạt động',
        visible: true,
        sort: false,
        width: '150px',
        align: 'center'
      },
    ];
  }

  async loadActiveOptions() {
    this.active_options = [{ label: '-- Trạng thái hoạt động --', value: null }];
    this.active_options.push({ label: 'Đang hoạt động', value: true });
    this.active_options.push({ label: 'Không hoạt động', value: false });
  }

  async loadDeleteOptions() {
    this.delete_options = [{ label: 'Không xóa', value: false }];
    this.delete_options.push({ label: 'Đã xóa', value: true });
  }

  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._WmProjectsService.GetDetailSprints(
      this.searchModel.key,
      this.idProject,
      this.searchModel.isActive,
      this.searchModel.isDelete,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
      this.isAsc
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        this.total = rs.totalRecord;
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
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

  onSearch() {
    this.getData();
  }

  onDeleteProject(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._WmProjectsService.delete(id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.dataSource = this.dataSource.filter(obj => obj.data.id !== id);
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }
  BackToDeleteProject(id: number) {
    this._WmProjectsService.delete(id).then(re => {
      if (re.status) {
        this._notifierService.showSuccess('Cập nhật thành công');
        this.dataSource = this.dataSource.filter(obj => obj.data.id !== id);
      }
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    })
  }

  changeActiveProject(id: number) {
    this._WmProjectsService.ChangeActive(id).then(re => {
      if (re.status) {
        var index = this.dataSource.findIndex(x => x.id == re.data.id)
        this.dataSource[index].data.isActived = re.data.isActived;
      }
      else {
        this._notifierService.showError(re.message);
      }
    })
  }

  toggleSearch() {
    super.toggleSearch();
    this.fixTableScrollProblem();
  }
  onChangeRowLimit() {
    this.fixTableScrollProblem();
  }
  // fix vụ lệch header ở table khi xuất hiện thanh scroll
  fixTableScrollProblem() {
    //this.dataSource = [...this.dataSource];
  }
  onCloseForm() {
    this.getData();
    this.loadMenuEditProjects.emit();
  }

  onEditProject(id: any) {
    this._ProjectEditComponent.showPopup(id);
  }
}
