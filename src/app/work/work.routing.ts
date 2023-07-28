import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../lib-shared/auth/guard.service';
import { TaskListComponent } from './task-list/task-list.component';
import { ProjectComponent } from './project/project.component';
import { ProjectColsComponent } from './status/project-cols.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { ProjectDocumentComponent } from './project-document/project-document.component';
import { NotesComponent } from './notes/notes.component';
import { ProjectReportComponent } from './project-report/project-report.component';
import { ProjectActivityComponent } from './project-activity/project-activity.component';
import { ProjectMemberComponent } from './project-member/project-member.component';
import { GroupTaskComponent } from './group-task/group-task.component';
import { GanttTaskComponent } from './gantt/gantt.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { TaskBoardComponent } from './task-board/task-board.component';

const routes: Routes = [
  {
    path: 'my-task',
    canActivate: [GuardService],
    component: MyTasksComponent,
    children: [
      // {
      //   path: '',
      //   //canActivateChild: [authGuard],
      //   children: [
      { path: 'list', component: TaskListComponent },
      { path: 'board', component: TaskBoardComponent },
      { path: 'document', component: ProjectDocumentComponent },
      { path: 'note', component: NotesComponent },
      { path: 'report', component: ProjectReportComponent },
      { path: 'gantt', component: GanttTaskComponent },
      { path: 'activity', component: ProjectActivityComponent },
      { path: 'member', component: ProjectMemberComponent },
      { path: 'config', component: ProjectColsComponent },
      { path: '', component: TaskListComponent }
      // ]
      // }
    ]
  },
  {
    path: 'group-task',
    canActivate: [GuardService],
    component: GroupTaskComponent,
    children: [
      // {
      //   path: '',
      //   //canActivateChild: [authGuard],
      //   children: [
      { path: 'list', component: TaskListComponent },
      { path: 'list/:idParent/:id', component: TaskListComponent },
      { path: 'list/:idParent/:id/:idTask', component: TaskListComponent },
      { path: 'board', component: TaskBoardComponent },
      { path: 'board/:idParent/:id', component: TaskBoardComponent },
      { path: 'board/:idParent/:id/:idTask', component: TaskBoardComponent },
      { path: 'document', component: ProjectDocumentComponent },
      { path: 'document/:idParent/:id', component: ProjectDocumentComponent },
      { path: 'note', component: NotesComponent },
      { path: 'note/:idParent/:id', component: NotesComponent },
      { path: 'report', component: ProjectReportComponent },
      { path: 'report/:idParent/:id', component: ProjectReportComponent },
      { path: 'gantt', component: GanttTaskComponent },
      { path: 'gantt/:idParent/:id', component: GanttTaskComponent },
      { path: 'activity', component: ProjectActivityComponent },
      { path: 'activity/:idParent/:id', component: ProjectActivityComponent },
      { path: 'member', component: ProjectMemberComponent },
      { path: 'member/:idParent/:id', component: ProjectMemberComponent },
      { path: 'config', component: ProjectColsComponent },
      { path: 'config/:idParent/:id', component: ProjectColsComponent },
      { path: '', component: ProjectDashboardComponent }
      // ]
      // }
    ]
  },
  {
    path: 'group-task/:id',
    canActivate: [GuardService],
    component: GroupTaskComponent,
  },
  {
    path: 'notes',
    canActivate: [GuardService],
    component: MyTasksComponent,
    children: [
      { path: '', component: NotesComponent }
    ]
  },
  {
    path: 'documents',
    canActivate: [GuardService],
    component: MyTasksComponent,
    children: [
      { path: '', component: ProjectDocumentComponent }
    ]
  },
  {
    path: 'project',
    canActivate: [GuardService],
    component: ProjectComponent,
    // outlet: 'sub'
  },
  {
    path: 'project-cols',
    canActivate: [GuardService],
    component: ProjectColsComponent
  },
  {
    path: 'my-task',
    canActivate: [GuardService],
    component: MyTasksComponent
  },
  { path: '', component: ProjectDashboardComponent, pathMatch: 'full' },
];

export const WorkRoutes = RouterModule.forChild(routes);
