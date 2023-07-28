import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/primeng';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  providers: [MessageService],
  styleUrls: ['./my-tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyTasksComponent extends SecondPageIndexBase implements OnInit {

  searchModel: any = {
    key: '',
    isActive: -1,
    type: -1
  };
  typeMenu: number = 2;
  idProject?: number = 1;
  checkMenu: boolean = true;
  tabNumber: number = 1;
  constructor(
    protected _injector: Injector,
    // private _WmProjectsService: WmProjectsService,
    // private router: Router
  ) { super(null, _injector); }

  async ngOnInit() {
    // this.items = [
    //    {
    //       "label": "Documents",
    //       "data": 1,
    //       "expandedIcon": "pi pi-folder-open",
    //       "collapsedIcon": "pi pi-folder",
    //       "leaf": true,
    //       "expanded": true,
    //       "key": "1",
    //       "children": [{
    //          "label": "Work",
    //          "data": "Work Folder",
    //          "expandedIcon": "pi pi-folder-open",
    //          "collapsedIcon": "pi pi-folder",
    //          "children": [{ "label": "Expenses.doc", "icon": "pi pi-file", "data": "Expenses Document" }, { "label": "Resume.doc", "icon": "pi pi-file", "data": "Resume Document" }]
    //       },
    //       {
    //          "label": "Home",
    //          "data": "1",
    //          "expandedIcon": "pi pi-folder-open",
    //          "collapsedIcon": "pi pi-folder",
    //          "children": [{ "label": "Invoices.txt", "icon": "pi pi-file", "data": "Invoices for this month" }]
    //       }]
    //    },
    //    {
    //       "label": "Pictures",
    //       "data": "1",
    //       "expandedIcon": "pi pi-folder-open",
    //       "collapsedIcon": "pi pi-folder",
    //       "children": [
    //          { "label": "barcelona.jpg", "icon": "pi pi-image", "data": "Barcelona Photo" },
    //          { "label": "logo.jpg", "icon": "pi pi-file", "data": "PrimeFaces Logo" },
    //          { "label": "primeui.png", "icon": "pi pi-image", "data": "PrimeUI Logo" }]
    //    },
    //    {
    //       "label": "Movies",
    //       "data": "1",
    //       "expandedIcon": "pi pi-folder-open",
    //       "collapsedIcon": "pi pi-folder",
    //       "children": [{
    //          "label": "Al Pacino",
    //          "data": "Pacino Movies",
    //          "children": [{ "label": "Scarface", "icon": "pi pi-video", "data": "Scarface Movie" }, { "label": "Serpico", "icon": "pi pi-file-video", "data": "Serpico Movie" }]
    //       },
    //       {
    //          "label": "Robert De Niro",
    //          "data": "De Niro Movies",
    //          "children": [{ "label": "Goodfellas", "icon": "pi pi-video", "data": "Goodfellas Movie" }, { "label": "Untouchables", "icon": "pi pi-video", "data": "Untouchables Movie" }]
    //       }]
    //    }
    // ];

    // await this.loadMenuProject();
  }

  // // danh sách sản phầm
  // async loadMenuProject() {
  //   this.items = [];
  //   await this._WmProjectsService.GetProjectsMenu("").then(rs => {
  //     if (rs.status) {
  //       this.items = rs.data;
  //     }
  //   });
  // }

  // nodeSelect(event) {
  //   this.typeMenu = event.node.data.type;
  //   this.idProject = event.node.data.idProject;
  //   this.idSprint = event.node.data.idSprint;
  //   this.checkMenu = !this.checkMenu;
  //   this.tabNumber = 1;
  //   // this._notifierService.showSuccess('Lựa chọn menu = ' + event.node.label);
  //   // console.log(event.node)
  // }

  // nodeUnselect(event) {
  //   this._notifierService.showSuccess('Bỏ lựa chọn menu = ' + event.node.label);
  // }

  changeTask(event, tabNumber) {
    this.tabNumber = tabNumber;
    event.currentTarget.classList.add("active_task_screen");
  }
}