import { Component, Input, OnInit, EventEmitter, Output, Injector } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { PermissionTypes } from '../../../lib-shared/vs-constants';
import { AppComponent } from '../../../app.component';
import { ComponentBase } from '../../../lib-shared/classes/base/component-base';
import { EventEmitterService } from '../../../services/eventemitter.service';
import { WmProjectsService } from '../../services/WmProjects.service';

@Component({
  selector: '[task-submenu]',
  templateUrl: './task-submenu.component.html',
  styleUrls: ['./task-submenu.component.scss'],
  animations: [
    trigger('children', [
      state('hiddenAnimated', style({
        height: '0px'
      })),
      state('visibleAnimated', style({
        height: '*'
      })),
      state('visible', style({
        display: 'block'
      })),
      state('hidden', style({
        display: 'none'
      })),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})

export class TaskSubmenuComponent extends ComponentBase {

  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;
  @Input() parentItem: MenuItem;

  _reset: boolean;

  _parentActive: boolean;

  activeIndex: number;

  permissionType: PermissionTypes = PermissionTypes.PAGE;

  isFirstLoad = true;

  urlProjectSelected = "";

  @Input() level: number;

  // danh sách id của các menu item được ghim
  @Input() pinnedMenuIds: number[];

  @Output() onTogglePin = new EventEmitter();

  @Output() onSelectMenu = new EventEmitter<any>();

  // menuItems: any = [
  //   { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: (event) => this.test() },
  // ];

  constructor(
    public app: AppComponent,
    private _router: Router,
    protected _injector: Injector,
    private _EventEmitterService: EventEmitterService,
    private _WmProjectsService: WmProjectsService,
  ) {
    super();
  }

  // async ngOnInit() {
  //   this._EventEmitterService.work.subscribe(item => this.urlProjectSelected = item);
  // }

  itemClick(event: Event, item: any, index: number) {

    //this._router.navigate(['/work/group-task/list/' + item.data.idProject, { idProject: item.data.idProject, idSprint: item.data.idSprint }]);

    //this._router.navigate([this._router.url, { idProject: item.data.idProject, idSprint: item.data.idSprint }]);

    // if (this._router.url == '/work/group-task/board')
    //   this._router.navigate([`/work/group-task/board/${item.data.idProject}/${item.data.idSprint}`]);
    // if (this._router.url == '/work/group-task/document')
    //   this._router.navigate([`/work/group-task/document/${item.data.idProject}/${item.data.idSprint}`]);
    // if (this._router.url == '/work/group-task/note')
    //   this._router.navigate([`/work/group-task/note/${item.data.idProject}/${item.data.idSprint}`]);

    // let url = "/work/group-task/list/";
    // if (this._router.url.includes('/list/'))
    //   url = "/work/group-task/board";
    // if (this._router.url.includes('/board/'))
    //   url = "/work/group-task/board";
    // if (this._router.url.includes('/gantt/'))
    //   url = "/work/group-task/gantt";
    // if (this._router.url.includes('/note/'))
    //   url = "/work/group-task/note";
    // if (this._router.url.includes('/document/'))
    //   url = "/work/group-task/document";
    // if (this._router.url.includes('/activity/'))
    //   url = "/work/group-task/activity";
    // if (this._router.url.includes('/report/'))
    //   url = "/work/group-task/report";
    // if (this._router.url.includes('/member/'))
    //   url = "/work/group-task/member";

    // this._router.navigate([`${url}/${item.data.idParent}/${item.data.id}`]);

    this._router.navigate([`/work/group-task/list/${item.data.idParent}/${item.data.id}`]);

    this.onSelectMenu.emit(item);
    // if (item.data.id > 0)
    //   this.getProject(item.data.id);

    this.isFirstLoad = false;
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }

    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // activate current item and deactivate active sibling if any
    this.activeIndex = (this.activeIndex === index) ? null : index;

    // execute command
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      setTimeout(() => {
        this.app.layoutMenuScrollerViewChild.moveBar();
      }, 450);
      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      if (this.app.isHorizontal() || this.app.isSlim()) {
        this.app.resetMenu = true;
      } else {
        this.app.resetMenu = false;
      }

      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }

    if (item.url || item.routerLink) {
      this.activeIndex = null;
      this.isFirstLoad = true;
    }
  }

  onMouseEnter(index: number) {
    if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())
      && !this.app.isMobile() && !this.app.isTablet()) {
      this.activeIndex = index;
    }
  }

  isActive(index: number, currentItem: any): boolean {
    if (!this.isFirstLoad) { return this.activeIndex == index; }

    if (currentItem && currentItem.routerLink) {
      if (this.isSameWithCurrentPageURL(currentItem.routerLink)) {
        this.activeIndex = index;
        return true;
      }
    }

    let arrUrl = null;
    if (!this.urlProjectSelected) arrUrl = this._router.url.split("/");
    else arrUrl = this.urlProjectSelected.split("/");

    if (arrUrl[arrUrl.length - 2] == `${currentItem.data.idParent}` && arrUrl[arrUrl.length - 1] == `${currentItem.data.id}`) {
      this.urlProjectSelected = "";
      return true;
    }

    if (currentItem && currentItem.items) {
      for (const i in currentItem.items) {
        const childItem = currentItem.items[i];
        if (this.isActive(index, childItem)) {
          return true;
        }
      }
    }

    return false;
  }

  private isSameWithCurrentPageURL(routerLink): boolean {
    const currentUrl = this._router.url;

    if (routerLink === currentUrl) {
      return true;
    }

    let currentUrlWithoutParam = currentUrl;

    if (currentUrlWithoutParam.includes('?')) {
      currentUrlWithoutParam = currentUrlWithoutParam.substr(0, currentUrlWithoutParam.indexOf('?'));
    }

    currentUrlWithoutParam = currentUrlWithoutParam.replace(/\d+/g, (str) => '--');

    return currentUrlWithoutParam === routerLink;
  }

  isNumber(element: any): boolean {
    return !isNaN(element);
  }

  togglePin(id) {
    this.onTogglePin.emit(id);
  }

  @Input() get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
      this.activeIndex = null;
    }
  }

  @Input() get parentActive(): boolean {
    return this._parentActive;
  }

  set parentActive(val: boolean) {
    this._parentActive = val;

    if (!this._parentActive) {
      this.activeIndex = null;
    }
  }

  nodeSelect(event) {
    this.onSelectMenu.emit(event);
  }

  // async getProject(idProject) {
  //   await this._WmProjectsService.getDetail(idProject)
  //     .then(async response => {
  //       if (response.status) {
  //         localStorage.setItem("project", JSON.stringify(response.data));
  //       }
  //     }, () => {
  //       this._notifierService.showHttpUnknowError();
  //     });
  // }
}