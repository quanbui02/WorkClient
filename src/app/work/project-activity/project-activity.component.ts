import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { LogWorkComponent } from '../log-work/log-work.component';

@Component({
  selector: 'app-project-activity',
  templateUrl: './project-activity.component.html',
  styleUrls: ['./project-activity.component.scss']
})
export class ProjectActivityComponent extends SecondPageIndexBase implements OnInit {
  idParent?: number;
  idProject?: number;
  myTask: boolean = false;
  @ViewChild(LogWorkComponent) _LogWorkComponent: LogWorkComponent;
  constructor(
    protected _injector: Injector,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    super(null, _injector);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      if (this.router.url.includes("my-task"))
        this.myTask = true;
      this.idProject = parseInt(params['id']);
      this.idParent = parseInt(params['idParent']);
    });

    // this._LogWorkComponent.showData(null, this.idProject, this.myTask); // show log
  }

}
