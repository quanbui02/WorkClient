import { Component, Injector, Input, OnInit } from '@angular/core';
import { SecondPageEditBase } from '../../lib-shared/classes/base/second-page-edit-base';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/primeng';
import { WmUsersService } from '../services/WmUsers.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent extends SecondPageEditBase implements OnInit {
  @Input() userId: number;
  @Input() showData: boolean

  modelEdit: any = {};
  constructor(
    protected _injector: Injector,
    public wmUserService: WmUsersService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    if (this.showData)
      await this.getDetailUser(this.userId);
  }

  async getDetailUser(id) {
    await this.wmUserService.GetDetail(id).then(rs => {
      if (rs.status) {
        this.modelEdit = rs.data;
      }
    });
  }

  getAvatar(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/avatar.jpg`;
  }

  urlMess() {
    return `/chat/${this.userId}`
  }
}
