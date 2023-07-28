import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { User } from '../../../lib-shared/models/user';
import { UserService } from '../../../lib-shared/services/user.service';
import { WmProjectMembersService } from '../../services/WmProjectMembers.service';

@Component({
  selector: 'app-project-member-edit',
  templateUrl: './project-member-edit.component.html',
  styleUrls: ['./project-member-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectMemberEditComponent extends SecondPageEditBase implements OnInit {
  @Input() idProject: any;
  key: string;
  isLoading = false;
  modelEdit: any = {
  };

  users: any;
  user = new User();
  total = 0;
  roles_options: any[] = [];

  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private _WmProjectMembersService: WmProjectMembersService,
    private activatedRoute: ActivatedRoute
  ) {
    super(null, _injector);
  }

  async ngOnInit() {

    this.formGroup = this.formBuilder.group({
      user: [''],
      role: [''],
      isProjectManager: [''],
    });
    this.loadRoles();
  }

  loadRoles() {
    this.roles_options = [{ label: 'Thành viên', value: 1 }];
    this.roles_options.push({ label: 'Theo dõi', value: 2 });
    this.roles_options.push({ label: 'Giám sát', value: 3 });
    this.roles_options.push({ label: 'Quản lý dự án', value: 4 });
  }

  async autoComplete(event) {
    const query = event.query;
    await this.userService.SearchNotInClient(query, 0, 10).then(rs => {
      if (rs.status) {
        this.users = rs.data;
        this.users.forEach(item => {
          item.fullDisplayName = item.name + '(' + item.userName + ')';
        });
        this.total = rs.totalRecord;
      }
    });
  }

  onSelect(event) {
    this.user = event;
    this.modelEdit.userId = event.userId;
  }

  save() {
    this.modelEdit.idProject = this.idProject;
    this._WmProjectMembersService.post(this.modelEdit).then(rs => {
      if (rs.status) {
        this._notifierService.showSuccess('Cập nhật thành công');
        this.isShow = false;
        this.closePopup.emit();
        this.modelEdit = {};
        this.user = null;
      } else {
        this._notifierService.showError(rs.message);
      }
    }).catch(error => {
      this._notifierService.showResponseError(error);
    });
  }

  async showPopup(id: any) {
    this.isShow = true;
    if (id > 0) {
      await this._WmProjectMembersService.getDetail(id).then(async response => {
        if (response.status) {
          this.modelEdit = response.data;
        }
      }, (error) => {
        this._notifierService.showResponseError(error);
      });
    } else {
      this.modelEdit = {};
    }
  }

}


