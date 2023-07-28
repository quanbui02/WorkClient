import { RouterModule, Routes } from '@angular/router';
import { ButtonComponent } from './button/button.component';
import { TableComponent } from './table/table.component';
import { PicklistComponent } from './picklist/picklist.component';
import { ModalComponent } from './modal/modal.component';
import { FieldComponent } from './field/field.component';

const routes: Routes = [

    {path: 'button', component: ButtonComponent},
    {path: 'table', component: TableComponent},
    {path: 'pick-list', component: PicklistComponent},
    {path: 'modal', component: ModalComponent},
    {path: 'field', component: FieldComponent},
];

export const ClientTemplateRoutes = RouterModule.forChild(routes);
