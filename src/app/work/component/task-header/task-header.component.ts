import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { WmProjectsService } from '../../services/WmProjects.service';
import { LinkComponent } from '../../link/link.component';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss']
})
export class TaskHeaderComponent extends SecondPageIndexBase implements OnInit {
  @Input() model?: any;
  myTask?: boolean = false;

  idProject: number = 0;
  idParent: number = 0;
  modelEdit: any = {
    name: "Công việc của tôi"
  };

  @ViewChild(LinkComponent) _LinkComponent: LinkComponent;

  constructor(
    protected _injector: Injector,
    private _WmProjectsService: WmProjectsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { super(null, _injector); }

  async ngOnInit() {
    await this.activatedRoute.params.subscribe(async params => {
      this.idProject = params['id'] == undefined ? 0 : parseInt(params['id']);
      this.idParent = params['idParent'] == undefined ? 0 : parseInt(params['idParent']);
      if (this.router.url.includes("group-task") == false)
        this.myTask = true;

      // this.modelEdit = JSON.parse(localStorage.getItem("project"));
      if (this.idProject > 0)
        await this.getProject(this.idProject);
    });
  }

  notifyTrigger(item) {
    this.modelEdit.name = item.label;
  }

  async getProject(idProject) {
    await this._WmProjectsService.getDetail(idProject)
      .then(async response => {
        if (response.status) {
          this.modelEdit = response.data;
          // localStorage.setItem("project", JSON.stringify(response.data));
        }
      }, () => {
        this._notifierService.showHttpUnknowError();
      });
  }

  buildUrl(url: string) {
    if (this.router.url.includes("my-task"))
      return url.replace("group-task", "my-task");

    return `${url}/${this.idParent}/${this.idProject}`;
  }

  checkActive(url: string) {
    if (this.router.url.includes("my-task"))
      url = url.replace("group-task", "my-task");

    url = `${url}/${this.idParent}/${this.idProject}`;
    if (url == this.router.url) return true;
    return false;
  }

  getDataLink() {
    this._LinkComponent.getData();
  }
}
