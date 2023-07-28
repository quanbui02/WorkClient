import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { WmShortCutLinksService } from '../services/WmShortCutLinks.service';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { async } from '@angular/core/testing';
import { LinkEditComponent } from './link-edit/link-edit.component';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent extends SecondPageIndexBase implements OnInit {
  @Input() idProject: number = 0;
  modelEdit: any = {};

  @ViewChild(LinkEditComponent) _LinkEditComponent: LinkEditComponent;
  constructor(
    protected _injector: Injector,
    private _WmShortCutLinksService: WmShortCutLinksService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
  }

  async getData() {
    this.isLoading = true;
    await this._WmShortCutLinksService.Gets(
      "",
      this.idProject,
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

  onEdit(id: number) {
    this._LinkEditComponent.showPopupLink(id, this.idProject)
  }
}
