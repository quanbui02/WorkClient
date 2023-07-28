import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { SecondPageIndexBase } from '../../../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../../../lib-shared/services/user.service';
import { WmTasksService } from '../../../services/WmTasks.service';

@Component({
  selector: 'app-board-card-edit',
  templateUrl: './board-card-edit.component.html',
  styleUrls: ['./board-card-edit.component.scss']
})
export class BoardCardEditComponent extends SecondPageIndexBase implements OnInit {
  @Input() idProject?: number;
  @Input() idProjectCol?: number;
  @Output() created = new EventEmitter<any>();
  modelEdit: any = {
    name: ""
  }
  crrUser: any;
  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    private _WmTasksService: WmTasksService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.crrUser = await this._userService.getCurrentUser();
    this.focusInput();
  }

  async save() {
    this.modelEdit = {
      name: this.modelEdit.name.trim(),
      idProject: this.idProject == 0 ? null : this.idProject,
      idProjectCol: this.idProjectCol == 0 ? null : this.idProjectCol,
      percent: 0,
      type: 1,
      priority: 3
    }
    await this._WmTasksService.post(this.modelEdit).then(async rs => {
      if (rs.status) {
        this.modelEdit.name = "";
        this.created.emit(true);
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

  getAvatar(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/avatar.jpg`;
  }

  focusInput() {
    let input = document.getElementById("input_name");
    input.focus();
  }

}