import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { UnauthorizeComponent } from './error/Unauthorize/Unauthorize.component';
import { GuardService } from './lib-shared/auth/guard.service';

export const routes: Routes = [
    {
        path: '',
        canActivate: [GuardService],
        loadChildren: './dapfood/dapfood.module#DapFoodModule'
        // {
        //     path: 'quan-ly-log',
        //     canActivate: [GuardService],
        //     data: {
        //         permissionRequired: {
        //             'log.api': {
        //                 LogsController: 2048
        //             }
        //         },
        //         heading: 'Quản lý Log hệ thống'
        //     },
        //     loadChildren: './quan-ly-log/quan-ly-log.module#LogsModule'
        // }
        // ]
    },
    {
        path: 'bao-cao',
        canActivate: [GuardService],
        loadChildren: './bao-cao/baocao.module#BaoCaoModule'
    },
    {
        path: 'dao-tao',
        canActivate: [GuardService],
        loadChildren: './dao-tao/daotao.module#DaoTaoModule'
    },
    {
        path: 'van-chuyen',
        canActivate: [GuardService],
        loadChildren: './dapfood/deliveries/delivery.module#DeliveryModule'
    },
    {
        path: 'work',
        canActivate: [GuardService],
        loadChildren: './work/work.module#WorkModule'
    },
    {
        path: 'logs',
        canActivate: [GuardService],
        loadChildren: './logs/logs.module#LogModule'
    },
    {
        path: 'unauthorize',
        component: UnauthorizeComponent
    },
    {
        path: 'template',
        canActivate: [GuardService],
        loadChildren: './client-template/client-template.module#ClientTemplateModule'
    },
    {
        path: 'user-managerment',
        canActivate: [GuardService],
        loadChildren: './user/user.module#UserModule'
    },
    {
        path: 'error',
        loadChildren: './error/error.module#ErrorModule'
    },
    {
        path: '**',
        redirectTo: 'error/404'
    }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy });
