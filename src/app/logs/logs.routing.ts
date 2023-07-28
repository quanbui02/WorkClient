import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../lib-shared/auth/guard.service';
import { LogsComponent } from './logs.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [GuardService],
        component: LogsComponent
    }

];

export const BaoCaoRoutes = RouterModule.forChild(routes);
