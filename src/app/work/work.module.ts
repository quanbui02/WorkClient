
import { RatingModule } from 'primeng/rating';
import { DataViewModule } from 'primeng/dataview';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { AutosizeModule } from 'ngx-autosize';
import { ClipboardModule } from 'ngx-clipboard';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import { DialogService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { TreeTableModule } from 'primeng/treetable';
import {
   AutoCompleteModule,
   CalendarModule,
   CheckboxModule,
   ConfirmDialogModule,
   EditorModule,
   FileUploadModule,
   InputSwitchModule,
   InputTextareaModule,
   InputTextModule,
   ListboxModule,
   MenuModule,
   MultiSelectModule,
   OverlayPanelModule,
   PaginatorModule,
   PanelModule,
   RadioButtonModule,
   SplitButtonModule,
   TabViewModule,
   TreeModule,
   AccordionModule,
   SelectButtonModule,
   ProgressSpinnerModule,
   SliderModule,
   PanelMenuModule,
   SidebarModule,
   DynamicDialogConfig,
   DynamicDialogRef,
   ColorPickerModule
} from 'primeng/primeng';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { FormioModule } from 'angular-formio';
import { NgxMaskModule } from 'ngx-mask';
import { PS_COMPONENT_CONFIG } from '../config/vs-component.config';
import { WorkRoutes } from './work.routing';
import { VsSharedModule } from '../lib-shared/lib-shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WmProjectColsService } from './services/WmProjectCols.service';
import { WmProjectsService } from './services/WmProjects.service';
import { WmTasksService } from './services/WmTasks.service';
import { TaskListComponent } from './task-list/task-list.component';
import { ProjectComponent } from './project/project.component';
import { ProjectEditComponent } from './project/project-edit/project-edit.component';
import { ProjectColsComponent } from './status/project-cols.component';
import { ProjectColsEditComponent } from './status/status-edit/project-cols-edit.component';
import { GanttTaskComponent } from './gantt/gantt.component';
import { NotesComponent } from './notes/notes.component';
import { ProjectDocumentComponent } from './project-document/project-document.component';
import { ProjectReportComponent } from './project-report/project-report.component';
import { ProjectActivityComponent } from './project-activity/project-activity.component';
import { ProjectMemberComponent } from './project-member/project-member.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { TaskMenuComponent } from './task-menu/task-menu.component';
import { TaskSubmenuComponent } from './task-menu/task-submenu/task-submenu.component';
import { ToolbarService, ContextMenuService, SortService, ResizeService, ExcelExportService, EditService, GanttModule, SelectionService, FilterService, VirtualScrollService } from '@syncfusion/ej2-angular-gantt';
import { CommentComponent } from './comment/comment.component';
import { WmTaskCommentsService } from './services/WmTaskComments.service';
import { GroupTaskComponent } from './group-task/group-task.component';
import { TaskHeaderComponent } from './component/task-header/task-header.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { ProjectMemberEditComponent } from './project-member/project-member-edit/project-member-edit.component';
import { WmProjectMembersService } from './services/WmProjectMembers.service';
import { TaskBoardComponent } from './task-board/task-board.component';
import { BoardColumnComponent } from './task-board/board-column/board-column.component';
import { BoardCardComponent } from './task-board/board-card/board-card.component';
import { BoardCardEditComponent } from './task-board/board-card/board-card-edit/board-card-edit.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { DeleteProjectColsComponent } from './status/delete-project-cols/delete-project-cols.component';
import { LogWorkComponent } from './log-work/log-work.component';
import { WmLogWorksService } from './services/WmLogWorks.service';
import { WmNoteService } from './services/WmNote.service';
import { NotesEditComponent } from './notes/notes-edit/notes-edit.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { UserViewComponent } from './user-view/user-view.component';
import { WmShortCutLinksService } from './services/WmShortCutLinks.service';
import { link } from 'fs';
import { LinkComponent } from './link/link.component';
import { LinkEditComponent } from './link/link-edit/link-edit.component';
import { WmUsersService } from './services/WmUsers.service';
import { WmTaskCommentLikesService } from './services/WmTaskCommentLikes.service';

export function getVsComponentConfigProvider() {
   return PS_COMPONENT_CONFIG;
}

@NgModule({
   imports: [
      WorkRoutes,
      TranslateModule,
      CommonModule,
      DialogModule,
      ButtonModule,
      PanelModule,
      RatingModule,
      ConfirmDialogModule,
      FieldsetModule,
      CheckboxModule,
      ToastModule,
      SplitButtonModule,
      TableModule,
      FieldsetModule,
      TooltipModule,
      ReactiveFormsModule,
      FormsModule,
      FormioModule,
      InputSwitchModule,
      CalendarModule,
      DropdownModule,
      InputTextModule,
      SelectButtonModule,
      DynamicDialogModule,
      InputTextareaModule,
      EditorModule,
      RadioButtonModule,
      FileUploadModule,
      ListboxModule,
      ContextMenuModule,
      TabViewModule,
      PaginatorModule,
      TreeModule,
      MultiSelectModule,
      ProgressSpinnerModule,
      OverlayPanelModule,
      MenuModule,
      AutosizeModule,
      AutoCompleteModule,
      NgxMaskModule.forRoot({
         showMaskTyped: true,
      }),
      AccordionModule,
      TreeTableModule,
      ClipboardModule,
      VsSharedModule.forRoot(getVsComponentConfigProvider),
      // GMapModule,
      AngularDualListBoxModule,
      DataViewModule,
      DragDropModule,
      SliderModule,
      PanelMenuModule,
      SidebarModule,
      GanttModule,
      ColorPickerModule
   ],
   entryComponents: [
      TaskEditComponent,
      NotesEditComponent,
      TaskViewComponent
   ],
   providers: [
      DynamicDialogConfig,
      DynamicDialogRef,
      DialogService,
      WmProjectColsService,
      WmProjectsService,
      WmTasksService,
      ToolbarService,
      EditService,
      ExcelExportService,
      SelectionService,
      FilterService,
      VirtualScrollService,
      ContextMenuService,
      EditService,
      SortService,
      WmTaskCommentsService,
      WmProjectMembersService,
      WmLogWorksService,
      WmNoteService,
      WmShortCutLinksService,
      WmUsersService,
      WmTaskCommentLikesService
   ],
   declarations: [
      // TaskMenuComponent,
      // TaskSubMenuComponent,
      TaskBoardComponent,
      BoardColumnComponent,
      BoardCardComponent,
      TaskListComponent,
      TaskEditComponent,
      ProjectComponent,
      ProjectEditComponent,
      ProjectColsComponent,
      ProjectColsEditComponent,
      GanttTaskComponent,
      NotesComponent,
      ProjectDocumentComponent,
      ProjectReportComponent,
      ProjectActivityComponent,
      ProjectMemberComponent,
      MyTasksComponent,
      TaskMenuComponent,
      TaskSubmenuComponent,
      CommentComponent,
      GroupTaskComponent,
      TaskHeaderComponent,
      ProjectDashboardComponent,
      BoardCardEditComponent,
      DeleteProjectColsComponent,
      ProjectMemberEditComponent,
      LogWorkComponent,
      NotesEditComponent,
      TaskViewComponent,
      UserViewComponent,
      LinkComponent,
      LinkEditComponent
   ]
})
export class WorkModule { }
