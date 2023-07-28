import { Component, OnInit, Input, Injector } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { Status } from '../../work.enum';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent extends SecondPageIndexBase implements OnInit {
  @Input() task: any;
  statusType: any = Status;
  curDate = new Date();

  constructor(
    protected _injector: Injector,
  ) {
    super(null, _injector);
    this.curDate = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), this.curDate.getDate());
  }

  ngOnInit() {
  }
  getImageTask(imageString) {
    return this.getAvatar(imageString.split(",")[0]);
  }
  getAvatar(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/avatar.jpg`;
  }

}