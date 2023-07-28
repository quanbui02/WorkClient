import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientTemplateRoutes } from './client-template.routing';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import {
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    EditorModule,
    FileUploadModule,
    InputSwitchModule,
    InputTextareaModule,
    InputTextModule,
    ListboxModule,
    MultiSelectModule,
    PaginatorModule,
    PanelModule,
    RadioButtonModule,
    SplitButtonModule,
    TabViewModule
} from 'primeng/primeng';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { FormioModule } from 'angular-formio';

import { TableComponent } from './table/table.component';
import { PicklistComponent } from './picklist/picklist.component';
import { ButtonComponent } from './button/button.component';
import { FieldComponent } from './field/field.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
    imports: [
        ClientTemplateRoutes,
        TranslateModule,
        CommonModule,
        DialogModule,
        ButtonModule,
        PanelModule,
        ConfirmDialogModule,
        CheckboxModule,
        ToastModule,
        SplitButtonModule,
        TableModule,
        TooltipModule,
        ReactiveFormsModule,
        FormsModule,
        FormioModule,
        TabViewModule,
        DropdownModule,
        MultiSelectModule,
        InputSwitchModule,
        CalendarModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        EditorModule,
        RadioButtonModule,
        FileUploadModule,
        ListboxModule,
        TabViewModule,
        DialogModule,
        PaginatorModule
    ],
    declarations: [
        ButtonComponent,
        TableComponent,
        ModalComponent,
        FieldComponent,
        PicklistComponent,
        PicklistComponent
    ]
})
export class ClientTemplateModule {
}
