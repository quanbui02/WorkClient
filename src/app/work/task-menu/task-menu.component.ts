import { Component, Input, OnInit, EventEmitter, Output, Injector } from '@angular/core';
// import { trigger, state, style, transition, animate } from '@angular/animations';
// import { MenuItem } from 'primeng/primeng';
// import { Subject } from 'rxjs/internal/Subject';
// import { Router } from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';
// import { HtMenuService } from '../../lib-shared/services/htmenu.service';
// import { NotifierService } from '../../lib-shared/services/notifier.service';
// import { environment } from '../../../environments/environment';
import { PermissionTypes } from '../../lib-shared/vs-constants';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-task-menu',
  templateUrl: './task-menu.component.html',
  styleUrls: ['./task-menu.component.scss'],
})
export class TaskMenuComponent implements OnInit {

  @Input() reset: boolean;

  @Input() model: any[];

  theme = 'orange';

  layout = 'orange';

  version = 'v3';

  @Output() nodeSelect = new EventEmitter<any>();

  permissionType: PermissionTypes = PermissionTypes.PAGE;

  // private _translateService: TranslateService;
  // private _notifierService: NotifierService;

  constructor(public app: AppComponent, private _injector: Injector) {
    // this._notifierService = this._injector.get(NotifierService);
    // this._translateService = this._injector.get(TranslateService);
  }

  ngOnInit() {
    // this.getPinnedMenuData();
  }

  // changeTheme(theme: string) {
  //   const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');

  //   if (this.version === 'v3') {
  //     themeLink.href = 'assets/theme/theme-' + theme + '.css';
  //   } else {
  //     themeLink.href = 'assets/theme/theme-' + theme + '-v4' + '.css';
  //   }

  //   this.theme = theme;

  // }

  // changeLayout(layout: string, special?: boolean) {
  //   const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');

  //   if (this.version === 'v3') {
  //     layoutLink.href = 'assets/layout/css/layout-' + layout + '.css';
  //   } else {
  //     layoutLink.href = 'assets/layout/css/layout-' + layout + '-v4' + '.css';
  //   }

  //   this.layout = layout;

  //   if (special) {
  //     this.app.darkMenu = true;
  //   }
  // }

  // changeVersion(version: string) {
  //   const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
  //   const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');

  //   if (version === 'v3') {
  //     this.version = 'v3';
  //     themeLink.href = 'assets/theme/theme-' + this.theme + '.css';
  //     layoutLink.href = 'assets/layout/css/layout-' + this.layout + '.css';
  //   } else {
  //     themeLink.href = 'assets/theme/theme-' + this.theme + '-v4' + '.css';
  //     layoutLink.href = 'assets/layout/css/layout-' + this.layout + '-v4' + '.css';
  //     this.version = '-v4';
  //   }

  // }

  onSelectMenu(item) {
    this.nodeSelect.emit(item);
  }

}