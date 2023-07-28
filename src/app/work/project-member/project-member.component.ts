import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { WmProjectMembersService } from '../services/WmProjectMembers.service';
import { ProjectMemberEditComponent } from './project-member-edit/project-member-edit.component';
@Component({
  selector: 'app-project-member',
  templateUrl: './project-member.component.html',
  styleUrls: ['./project-member.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectMemberComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: '',
    idProject: -1,
    isActived: -1,
    type: -1
  };
  active_options: any[];
  showPopup: boolean[] = [];

  @ViewChild(ProjectMemberEditComponent) _ProjectMemberEditComponent: ProjectMemberEditComponent;

  constructor(
    protected _injector: Injector,
    private _WmProjectMembersService: WmProjectMembersService,
    private activatedRoute: ActivatedRoute
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.cols = [
      {
        field: 'userId',
        header: 'Mã',
        visible: false,
        width: '20%',
        sort: true
      },
      {
        field: 'name',
        header: 'Họ và tên',
        visible: true,
        sort: true
      },
      {
        field: 'role',
        header: 'Vai trò',
        width: '20%',
        visible: true,
        sort: true
      }
    ];

    await this.loadActiveOptions();
    await this.activatedRoute.params.subscribe(async params => {
      this.searchModel.idProject = parseInt(params['id']);
      // this.searchModel.idParent = parseInt(params['idParent']);
      await this.getData();
    });
  }

  async loadActiveOptions() {
    this.active_options = [{ label: '-- Trạng thái --', value: -1 }];
    this.active_options.push({ label: 'Không sử dụng', value: 0 });
    this.active_options.push({ label: 'Sử dụng', value: 1 });
  }

  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._WmProjectMembersService.GetsByIdProject(
      this.searchModel.key,
      this.searchModel.idProject,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
      this.isAsc
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        this.total = rs.totalRecord;
      }
    }).catch(error => {
      this.isLoading = false;
      this._notifierService.showResponseError(error);
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }

  onSearch() {
    this.getData();
  }

  onEdit(id: any) {
    this._ProjectMemberEditComponent.showPopup(id);
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi ?', 'Bạn có chắc muốn xóa bản ghi này ?').then(rs => {
      this._WmProjectMembersService.delete(id).then(re => {
        if (re.status) {
          this.dataSource = this.dataSource.filter(obj => obj.id !== id);
          this._notifierService.showSuccess(re.message);
        }
        else
          this._notifierService.showError(re.message);
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
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
  }
}


