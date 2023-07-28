import { DeliveryServiceComponent } from './delivery-service/delivery-service.component';

import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../../lib-shared/auth/guard.service';
import { DeliveryCategoriesComponent } from './delivery-categories/DeliveryCategories.component';

const routes: Routes = [
    {
        path: 'delivery-category',
        canActivate: [GuardService],
        component: DeliveryCategoriesComponent
    },
    {
        path: 'delivery-service',
        canActivate: [GuardService],
        component: DeliveryServiceComponent
    },
];

export const DeliveryRoutes = RouterModule.forChild(routes);
