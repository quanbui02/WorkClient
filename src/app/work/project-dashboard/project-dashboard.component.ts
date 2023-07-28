import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../lib-shared/services/user.service';
import { ProjectEditComponent } from '../project/project-edit/project-edit.component';
import { WmProjectsService } from '../services/WmProjects.service';
import { EventEmitterService } from '../../services/eventemitter.service';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent extends SecondPageIndexBase implements OnInit {
  idProject?: number;
  idSprint: number;
  @Output() idSprintEmitter = new EventEmitter<any>();

  searchModel: any = {
    key: '',
    isComplete: null
  };
  userId: number;
  complete_options = [];
  type_options = [];
  status_options = [];
  priority_options = [];
  star_options = [];
  isSearch = false;

  @ViewChild(ProjectEditComponent) _ProjectEditComponent: ProjectEditComponent;

  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    private _WmProjectService: WmProjectsService,
    private _EventEmitterService: EventEmitterService,
  ) {
    super(null, _injector);
    this.loadCompleteOptions();
  }

  async ngOnInit() {
    this.userId = this._userService.getBasicUserInfo().userId;
    await this.getData();
  }

  loadCompleteOptions() {
    this.complete_options = [{ label: '-- Trạng thái hoàn thành --', value: null }];
    this.complete_options.push({ label: 'Hoàn thành', value: true });
    this.complete_options.push({ label: 'Chưa hoàn thành', value: false });
  }

  async getData() {
    this.isLoading = true;
    await this._WmProjectService.GetProjectDashboard(
      this.searchModel.key,
      this.searchModel.isComplete,
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

  // urlTask(id) {
  //   this._EventEmitterService.work.emit(`/work/group-task/list/0/${id}`);
  //   this._router.navigate([`/work/group-task/list/0/${id}`]);
  // }

  urlTask(id) {
    return `/work/group-task/list/0/${id}`
  }
  onSearch() {
    this.getData();
  }

  onCloseForm() {
    this.getData();
  }

  onEdit(id: any) {
    this._ProjectEditComponent.showPopup(id);
  }

  // openSearchName() {
  //   let input = document.getElementById("input_search_name");
  //   let inputNameBox = document.getElementById("search_name");

  //   inputNameBox.classList.add("active");
  //   input.focus();
  // }

  // closeSearchName() {
  //   let inputNameBox = document.getElementById("search_name");

  //   this.searchModel.key = "";
  //   inputNameBox.classList.remove("active");
  // }

  openSearchName() {
    this.isSearch = true;
    let input = document.getElementById("input_search_name");
    input.focus();
  }

  openFilterTask(item: any) {
    // let overlayBox = document.getElementById("filterTask_overlay");
    // let btn = document.getElementById("filterTask_btn");
    // overlayBox.classList.add("active");
    // btn.classList.add("btn_active");
  }

  closeFilterTask() {
    // let overlayBox = document.getElementById("filterTask_overlay");
    // let btn = document.getElementById("filterTask_btn");

    // overlayBox.classList.remove("active");
    // btn.classList.remove("btn_active");
  }

  outsideClick(hasClickedOutside) {
    // let overlayBox = document.getElementById("filterTask_overlay");

    // if (overlayBox.classList.value == "overlay active" && hasClickedOutside)
    //   this.closeFilterTask();
  }
  onSearchCustom() {

  }

}
