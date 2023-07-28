import { Routes } from '@angular/router';
import { UserIndexComponent } from './index/user-index.component';

export const UserRoutes: Routes = [{
    path: '',
    component: UserIndexComponent,
    data: {
        heading: 'Quản lý người dùng'
    }
}];
