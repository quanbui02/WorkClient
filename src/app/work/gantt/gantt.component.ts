import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { Gantt } from '@syncfusion/ej2-gantt';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { localdata } from './locale.gantt';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { WmProjectsService } from '../services/WmProjects.service';
import { WmTasksService } from '../services/WmTasks.service';

import { GanttComponent, TimelineViewMode, VirtualScrollService } from '@syncfusion/ej2-angular-gantt';
import { ToolbarItem, EditSettingsModel, ContextMenuClickEventArgs, ContextMenuOpenEventArgs } from '@syncfusion/ej2-angular-gantt';
import { ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { ActivatedRoute } from '@angular/router';
import { WmProjectMembersService } from '../services/WmProjectMembers.service';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { TaskEditComponent } from '../task-edit/task-edit.component';

//https://ej2.syncfusion.com/angular/demos/#/bootstrap5/gantt/resources

setCulture('en-US');
L10n.load(localdata);
@Component({
   selector: 'app-gantt',
   templateUrl: './gantt.component.html',
   styleUrls: ['./gantt.component.scss']
})
export class GanttTaskComponent extends SecondPageIndexBase implements OnInit {
   idParent?: number;
   idProject?: number;

   public dataTasks: any[] = [];
   // Data for Gantt
   public data: any[] = [];
   public taskSettings: object;
   public splitterSettings: object;
   public columns: object[];
   public editSettings: EditSettingsModel;
   public toolbar: any;
   public labelSettings: object;
   public timelineSettings: object;
   public timezoneValue: string = 'UTC';
   public dayWorkingTime: object[];
   public sortSettings: object;
   public filterSettings: object;
   public resources: object[];
   public resourceFields: object;
   public tooltipSettings: object;
   public editDialogFields: object[];
   public gridLines: string;
   public contextMenuItems: (string | ContextMenuItemModel)[];
   public copiedRecord: any;
   // @ViewChild(TaskEditComponent) _TaskEditComponent: TaskEditComponent;
   @ViewChild('ganttTasks')
   public ganttObj: GanttComponent;
   ref: DynamicDialogRef;
   constructor(
      protected _injector: Injector,
      private _WmProjectsService: WmProjectsService,
      private _WmTasksService: WmTasksService,
      private _WmProjectMembersService: WmProjectMembersService,
      private activatedRoute: ActivatedRoute,
      public dialogService: DialogService,
   ) { super(null, _injector); }

   async ngOnInit() {
      this.activatedRoute.params.subscribe(async params => {
         this.idProject = params['id'] == undefined ? 0 : parseInt(params['id']);
         this.idParent = params['idParent'] == undefined ? 0 : parseInt(params['idParent']);
         await this.loadResources();
         await this.loadGantt();
         await this.loadMember();
      });
   }
   //#region load dữ liệu 
   public customFunction(data: any): string {
      var container = document.createElement('div');

      if (data.ganttProperties.resourceNames) {

         data.ganttProperties.resourceInfo.forEach(item => {
            if (item.resourceName) {
               var subContainer = document.createElement('div');
               subContainer.className = 'subAvatarContainer'
               var span = document.createElement('span');
               span.className = 'labelClass';
               span.innerHTML = item.resourceName;
               if (item.avatar !== null && item.avatar !== "" && item.avatar !== undefined) {
                  var img = document.createElement('img');
                  img.className = 'avatar_user';
                  img.src = this.getImageAvatar(item.avatar);
                  subContainer.append(img);
               }
               subContainer.append(span);
               container.append(subContainer);
            }
         });
      }
      return container.innerHTML;
   }

   async loadGantt() {
      this.isLoading = true;
      await this._WmProjectsService.GetsGanttProjectSprint(this.idProject).then(rs => {
         if (rs.status) {
            let virtualData: any[] = [];
            rs.data.forEach(item => {
               virtualData.push({
                  taskID: item.taskId,
                  GanttId: item.id,
                  TypeGantt: item.typeGantt,
                  taskName: item.taskName,
                  Image: item.image,
                  StartDate: item.startDate,
                  Progress: item.progress,
                  Duration: item.endDate ? item.duration : null,
                  EndDate: item.endDate,
                  TaskStatus: item.taskStatus,
                  parentID: item.parentId,
                  ParentCode: item.ParentCode,
                  resources: item.resources,
                  IdProjectCol: item.idProjectCol,
                  IdAssignee: item.idAssignee,
                  IdProject: item.idProject,
                  GanttInternal: false
               });
            });
            this.data = virtualData;
         }
      });
      this.isLoading = false;
   }

   async loadMember() {
      await this._WmProjectMembersService.GetsByIdProject("", this.idProject, 0, 1000).then(rs => {
         if (rs.status) {
            let virtualData: object[] = [];
            rs.data.forEach(item => {
               virtualData.push({
                  resourceId: item.userId,
                  resourceName: item.name,
                  avatar: item.avatar
               });
            });
            this.resources = virtualData;
         }
      });
   }

   async loadResources() {
      this.editDialogFields = [
         { type: 'General', headerText: 'Thông tin chung' },
         // { type: 'Dependency' },
         // { type: 'Resources' },
         // { type: 'Notes' }
      ];
      this.resourceFields = {
         id: 'resourceId',
         name: 'resourceName',
         unit: 'unit',
         avatar: 'avatar'
      };
      this.taskSettings = {
         id: 'taskID',
         ganttId: 'GanttId',
         name: 'taskName',
         startDate: 'StartDate',
         endDate: 'EndDate',
         duration: 'Duration',
         progress: 'Progress',
         typeGantt: 'TypeGantt',
         taskStatus: 'TaskStatus',
         resourceInfo: 'resources',
         parentID: 'parentID',
         ParentCode: 'ParentCode',
         ganttInternal: 'GanttInternal',
         image: 'Image',
         IdProjectCol: 'IdProjectCol',
         IdAssignee: 'IdAssignee',
         IdProject: 'IdProject'

      };

      this.splitterSettings = {
         columnIndex: 2
      };
      this.labelSettings = {
         leftLabel: 'taskName',
         taskLabel: '${Progress}%',
         //rightLabel: 'resources',
      };
      this.tooltipSettings = {
         showTooltip: true
      }
      this.editSettings = {
         allowAdding: true,
         allowEditing: true,
         allowDeleting: true,
         allowTaskbarEditing: true,
         //showDeleteConfirmDialog: true
      };
      if (Number.isNaN(this.idProject) || this.idProject === 0 || typeof this.idProject === "undefined") {
         //this.toolbar = ['Cancel', 'CollapseAll', 'ExpandAll', 'Search', 'ExcelExport', 'CsvExport', 'NextTimeSpan', 'PrevTimeSpan']
         this.toolbar = ['Cancel', 'CollapseAll', 'ExpandAll', 'Search', 'ExcelExport', 'CsvExport', { text: 'Ngày', tooltipText: 'Hiển thị theo ngày', id: 'ViewDay', prefixIcon: 'e-day', align: 'Right' }, { text: 'Tuần', tooltipText: 'Hiển thị theo tuần', id: 'ViewWeek', prefixIcon: 'e-work-week', align: 'Right' }, { text: 'Tháng', tooltipText: 'Hiển thị theo tháng', id: 'ViewMonth', prefixIcon: 'e-timeline-month', align: 'Right' }, { text: 'Năm', tooltipText: 'Hiển thị theo năm', id: 'ViewYear', prefixIcon: 'e-date-range', align: 'Right' }]
      }
      else {
         this.toolbar = [{ text: 'Thêm mới', tooltipText: 'Thêm mới', id: 'AddTask', prefixIcon: 'e-add' }, 'Cancel', 'CollapseAll', 'ExpandAll', 'Search', 'ExcelExport', 'CsvExport', 'NextTimeSpan', 'PrevTimeSpan', { text: 'Ngày', tooltipText: 'Hiển thị theo ngày', id: 'ViewDay', prefixIcon: 'e-day', align: 'Right' }, { text: 'Tuần', tooltipText: 'Hiển thị theo tuần', id: 'ViewWeek', prefixIcon: 'e-work-week', align: 'Right' }, { text: 'Tháng', tooltipText: 'Hiển thị theo tháng', id: 'ViewMonth', prefixIcon: 'e-timeline-month', align: 'Right' }, { text: 'Năm', tooltipText: 'Hiển thị theo năm', id: 'ViewYear', prefixIcon: 'e-date-range', align: 'Right' }]
      }
      // this.contextMenuItems = ['TaskInformation', 'DeleteTask', 'Save', 'Cancel', 'SortAscending', 'SortDescending', 'Add',
      this.contextMenuItems = ['Save', 'Cancel', 'SortAscending', 'SortDescending',
         { text: 'Chỉnh sửa', target: '.e-content', id: 'edittask', iconCss: 'e-menu-icon e-icons e-edit' } as ContextMenuItemModel,
         { text: 'Xóa', target: '.e-content', id: 'deletetask', iconCss: 'e-menu-icon e-icons e-delete' } as ContextMenuItemModel,
         { text: 'Copy', target: '.e-content', id: 'copy', iconCss: 'e-menu-icon e-icons e-copy' } as ContextMenuItemModel,
         { text: 'Paste', target: '.e-content', id: 'paste', iconCss: 'e-icons e-paste' } as ContextMenuItemModel,
         { text: 'Thu gọn hàng', target: '.e-content', id: 'collapserow', iconCss: 'e-icons e-minimize e-collapseall' } as ContextMenuItemModel,
         { text: 'Mở rộng hàng', target: '.e-content', id: 'expandrow', iconCss: 'e-icons e-expandall' } as ContextMenuItemModel,
      ];
      this.filterSettings = {
         type: 'Menu'
      };
      this.gridLines = 'Both';
      this.timelineSettings = {
         topTier: {
            unit: 'Week',
            format: 'MMM dd, yyyy'
         },
         bottomTier: {
            unit: 'Day',
            count: 1,
            format: 'dd'
         },
         // topTier: {
         //    unit: 'Week',
         //    format: 'MMM dd, yyyy'
         // },
         // bottomTier: {
         //    unit: 'Day',
         //    count: 1,
         //    format: 'dd'
         // },
      };
      this.dayWorkingTime = [{ from: 0, to: 24 }];
   }

   // async GetsByIdProject() {
   //    this.resources = [];
   //    await this._WmProjectMembersService.GetsByIdProject(
   //      '',
   //      this.idProject,
   //      0,
   //      1000
   //    ).then(rs => {
   //      if (rs.status) {
   //        rs.data.forEach(value => {
   //          this.resources.push({ resourceName: value.name, resourceId: value.userId });
   //        });
   //      }
   //    });
   // } 
   //#endregion

   onCloseForm(item: any) {
      if (item) {
         let task: any = {
            GanttId: item.id,
            TypeGantt: 3,
            taskName: item.name,
            StartDate: item.startDate ? item.startDate : null,
            //Duration: rs.data[i].duration,
            Progress: item.percent,
            EndDate: item.endDate ? item.endDate : null,
            TaskStatus: item.startDate ? true : false,
            //resources: rs.data[i].resources,
            //parentId: rs.data[i].parentId,
            GanttInternal: false,
            ParentCode: item.idProject,
            IdProjectCol: item.idProjectCol,
            IdAssignee: item.idAssignee,
         };
         this.ganttObj.addRecord(task, 'Above');
      }
   }

   // nếu là project thì không cho phép chỉnh sửa
   cellEdit(datarow): void {
      if (datarow.rowData.taskData.TypeGantt == 1)
         datarow.cancel = true;
      if (datarow.columnName == 'resources' || datarow.columnName == 'Duration')
         datarow.cancel = true
   }

   //#region tùy chỉnh giao diện trong các thành phần gantt
   public queryTaskbarInfo(args: any): void {
      if (args.data.Progress < 50) {
         args.progressBarBgColor = "#c9cbcf";
      } else if (args.data.Progress < 70) {
         args.progressBarBgColor = "#36a2eb";
      } else if (args.data.Progress < 90) {
         args.progressBarBgColor = "#4bc0c0";
      } else if (args.data.Progress <= 100) {
         args.progressBarBgColor = "#5fcb89";
      }
   };
   public queryCellInfo(args: any) {
      if (args.column.field == "Progress") {
         // if (args.data.taskData.TypeGantt == 3 && args.data.taskData.TaskStatus == true && args.data.Progress <= 50) {
         //    args.cell.style.backgroundColor = "red";
         // } else if (args.data.taskData.TypeGantt == 3 && args.data.taskData.TaskStatus == true && args.data.Progress <= 70) {
         //    args.cell.style.backgroundColor = "yellow";
         // } else if (args.data.taskData.TypeGantt == 3 && args.data.taskData.TaskStatus == true && args.data.Progress <= 80) {
         //    args.cell.style.backgroundColor = "lightgreen";
         // }
      }
   };
   public rowDataBound(args: any) {
      // if (args.data.taskData.TypeGantt == 3 && args.data.taskData.TaskStatus == true && args.data.Progress <= 50) {
      //    args.row.style.backgroundColor = "red"
      // } else if (args.data.taskData.TypeGantt == 3 && args.data.taskData.TaskStatus == true && args.data.Progress <= 70) {
      //    args.row.style.backgroundColor = "yellow";
      // } else if (args.data.taskData.TypeGantt == 3 && args.data.taskData.TaskStatus == true && args.data.Progress <= 80) {
      //    args.row.style.backgroundColor = "lightgreen";
      // }
   };
   //#endregion
   //#region chức năng khi người dùng click vào menu ở trong gantt
   async contextMenuClick(args: ContextMenuClickEventArgs) {
      //let record = args.rowData;

      let objrow: any = args.rowData.taskData.valueOf();
      // console.log("contextMenuClick");
      // console.log(JSON.stringify(objrow));
      if (args.item.id === 'edittask') {
         this.ref = this.dialogService.open(TaskEditComponent, {
            data: {
               id: objrow.GanttId,
               idProjectCol: objrow.IdProjectCol,
               idProject: this.idProject
            },
            showHeader: false,
            header: '',
            width: '95%',
            height: 'calc(100vh - 50px)',
            styleClass: "vs-modal",
            contentStyle: { 'overflow': 'auto' }, //'max-height': 'calc(100vh - 180px);', 
            baseZIndex: 1001,
            closeOnEscape: true
         });

         this.ref.onClose.subscribe((re: any) => {
            if (re != null) {
               this.isLoading = false;
               this.onCloseForm(re);
            }
         });
      }
      if (args.item.id === 'deletetask') {
         this._notifierService.showConfirm('Bạn có chắc muốn xóa công việc này này?', 'Xóa công việc').then(rs => {
            this._WmTasksService.delete(objrow.GanttId).then(rs => {
               if (rs.status) {
                  this.ganttObj.editModule.deleteRecord(args.rowData.ganttProperties.taskId);
                  this._notifierService.showSuccess("Xóa công việc thành công");
               } else {
                  this._notifierService.showError(rs.message);
               }
            });
         }).catch(err => {
            this._notifierService.showDeleteDataError();
         });
      }
      if (args.item.id === 'copy') {
         this.copiedRecord = args.rowData;
         this.copiedRecord.taskData.TaskID = this.ganttObj.currentViewData.length + 1;
      }
      if (args.item.id === 'paste') {
         // console.log("row select");
         // console.log(JSON.stringify(record));
         let idCopyProject = this.idProject;
         if (objrow.TypeGantt === 1)
            idCopyProject = objrow.GanttId;
         else
            idCopyProject = objrow.ParentCode;
         var objproject: any = {
            name: this.copiedRecord.taskData.taskName,
            //description: newdataproject.taskName,
            startDate: this.copiedRecord.taskData.StartDate,
            endDate: this.copiedRecord.taskData.EndDate,
            percent: this.copiedRecord.taskData.Progress,
            idProject: idCopyProject,
            idProjectCol: this.copiedRecord.taskData.IdProjectCol,
            idAssignee: this.copiedRecord.taskData.IdAssignee
         };
         await this._WmTasksService.Save(objproject).then(rs => {
            if (rs.status) {
               this.copiedRecord.taskData.parentId = objrow.parentId;
               this.copiedRecord.taskData.TypeGantt = objrow.TypeGantt + 1;
               this.copiedRecord.taskData.GanttId = rs.data.id;
               this.copiedRecord.taskData.TypeGantt = 3;
               // console.log("row copy");
               // console.log(JSON.stringify(this.copiedRecord.taskData));
               if (objrow.TypeGantt === 1)
                  this.ganttObj.addRecord(this.copiedRecord.taskData, 'Child', args.rowData.index);
               else
                  this.ganttObj.addRecord(this.copiedRecord.taskData, 'Above', args.rowData.index);
            } else {
               this._notifierService.showError(rs.message);
            }
         });

         // if (this.idSprint != null && this.idSprint > 0) {
         //    this.ganttObj.addRecord(this.copiedRecord.taskData, 'Above', args.rowData.index);
         // } else {

         // }
         this.copiedRecord = undefined;
      }
      if (args.item.id === 'collapserow') {
         this.ganttObj.collapseByID(Number(args.rowData.ganttProperties.taskId));
      }
      if (args.item.id === 'expandrow') {
         this.ganttObj.collapseByID(Number(args.rowData.ganttProperties.taskId));
      }
   }

   //ẩn hiện menu khi người dùng click chuột phải vào công việc
   public contextMenuOpen(args: ContextMenuOpenEventArgs) {
      //let record = args.rowData;
      if (args.type !== 'Header') {
         //console.log("contextMenuOpen type: " + args.type);
         let objrow: any = args.rowData.taskData.valueOf();
         // console.log("contextMenuOpen type: " + JSON.stringify(objrow));
         if (objrow.TypeGantt == 1 || objrow.TypeGantt == 2) {
            //console.log("contextMenuOpen type: " + objrow.TypeGantt);
            args.hideItems.push('Xóa');
            //args.hideItems.push('Thêm vào');
            //args.hideItems.push('Cột mốc');
            args.hideItems.push('Chỉnh sửa');
            //args.hideItems.push('Copy');
         }

         if (this.copiedRecord) {
            args.hideItems.push('Copy');
         } else {
            args.hideItems.push('Paste');
         }
         if (objrow.TypeGantt == 1)
            args.hideItems.push('Paste');
         // if (objrow.TypeGantt == 1 || objrow.TypeGantt == 2)
         //    args.hideItems.push('Copy');
         if (!args.rowData.hasChildRecords) {
            args.hideItems.push('Thu gọn hàng');
            args.hideItems.push('Mở rộng hàng');
            // args.hideItems.push('TaskInformation');
         } else {
            if (args.rowData.expanded) {
               args.hideItems.push("Mở rộng hàng");
            } else {
               args.hideItems.push("Thu gọn hàng");
            }
         }
      }
   }
   //#endregion
   //#region sự kiên kiện trên thanh Toolbar
   public toolbarClick(args: ClickEventArgs): void {
      //console.log("click chọn menu bar: " + JSON.stringify(args.item));
      if (args.item.id === 'ganttTasks_excelexport') {
         this.ganttObj.excelExport();
      } else if (args.item.id === 'ganttTasks_csvexport') {
         this.ganttObj.csvExport();
      }
      else if (args.item.id === 'ganttTasks_pdfexport') {
         this.ganttObj.pdfExport();
      }
      else if (args.item.id === 'AddTask') {
         this.ref = this.dialogService.open(TaskEditComponent, {
            data: {
               id: 0,
               idProjectCol: 0,
               idProject: this.idProject
            },
            showHeader: false,
            header: '',
            width: '95%',
            height: 'calc(100vh - 100px)',
            styleClass: "vs-modal",
            contentStyle: { 'overflow': 'auto' }, //'max-height': 'calc(100vh - 180px);', 
            baseZIndex: 1001,
            closeOnEscape: true
         });

         this.ref.onClose.subscribe((re: any) => {
            if (re != null) {
               this.isLoading = false;
               this.onCloseForm(re);
            }
         });
      }
      else if (args.item.id === 'ViewYear') {
         this.ganttObj.timelineSettings.topTier.unit = 'Year';
         this.ganttObj.timelineSettings.bottomTier.unit = 'Year';
         this.ganttObj.timelineSettings.bottomTier.format = 'y';
      }
      else if (args.item.id === 'ViewMonth') {
         this.ganttObj.timelineSettings.topTier.unit = 'Year';
         this.ganttObj.timelineSettings.bottomTier.unit = 'Month';
         this.ganttObj.timelineSettings.bottomTier.format = 'MMM';
      }
      else if (args.item.id === 'ViewWeek') {
         this.ganttObj.timelineSettings.topTier.unit = 'Month';
         this.ganttObj.timelineSettings.bottomTier.unit = 'Week';
         // this.ganttObj.timelineSettings.bottomTier.format = 'EEE MMM dd';
      }
      else if (args.item.id === 'ViewDay') {
         this.ganttObj.timelineSettings.topTier.unit = 'Week';
         this.ganttObj.timelineSettings.bottomTier.unit = 'Day' as TimelineViewMode;
         this.ganttObj.timelineSettings.bottomTier.format = 'dd';
      }
   };


   taskbarEditing(event): void {
      // console.log(JSON.stringify(event));
      //this._notifierService.showSuccess('Gantt <b>taskbarEditing</b> event called<hr>');
   }

   //bắt sự kiện khi hoàn thành thêm mới, chỉnh sửa, xóa
   async actionComplete(args: any) {
      //console.log("actionComplete: " + args.requestType)
      //chọn xóa trên gantt
      if (args.requestType === 'delete') {
         // console.log("actionComplete xác nhận xóa công việc");
         // console.log(JSON.stringify(args));
      }
      //chỉnh sửa công việc chọn lưu trên 
      if (args.requestType === 'save') {
         // console.log("actionComplete cập nhật công việc");
         // console.log(JSON.stringify(args));
         var datatask: any = args.data.taskData;
         //cập nhật project
         if (datatask !== null && datatask.TypeGantt == 1) {
            console.log("dataTask", datatask);
            var objproject: any = {
               id: datatask.GanttId,
               name: datatask.taskName,
               //description: datatask.taskName,
               startDate: datatask.StartDate,
               endDate: datatask.EndDate,
               percent: datatask.Progress,
               idProjectCol: datatask.IdProjectCol,
               idAssignee: datatask.IdAssignee,
               idProject: datatask.IdProject,
            };
            this._WmProjectsService.Save(objproject).then(rs => {
               if (rs.status) {
                  // console.log("log cập nhật dữ lieu");
                  // console.log(JSON.stringify(rs.status));
               } else {
                  this._notifierService.showError(rs.message);
               }
            });
         }
         //cập nhật công việc
         else if (datatask !== null && datatask.TypeGantt == 3) {
            var objtask: any = {
               id: datatask.GanttId,
               name: datatask.taskName,
               //description: datatask.taskName,
               startDate: datatask.StartDate,
               endDate: datatask.EndDate,
               percent: datatask.Progress,
               idProjectCol: datatask.IdProjectCol,
               idAssignee: datatask.IdAssignee,
               idProject: datatask.IdProject,
            };
            // console.log("log cập nhật công việc");
            // console.log(JSON.stringify(objtask));
            this._WmTasksService.Save(objtask).then(rs => {
               if (rs.status) {
                  // console.log("log cập nhật dữ lieu");
                  // console.log(JSON.stringify(rs.status));
               } else {
                  this._notifierService.showError(rs.message);
               }
            });
         }
      }
   };
   //#endregion

   getAvatar(item: any) {
      //console.log("dữ liệu ảnh", JSON.stringify(item));
      if (item.TypeGantt == 1) {
         if (item.Image != null && item.Image != "" && item.Image != undefined) {
            return this.getImageAvatar(item.Image);
         }
         else
            return `/assets/images/iconproject.png`;
      }
      else {
         return `/assets/images/icontask.jpg`;
      }
   }
}
