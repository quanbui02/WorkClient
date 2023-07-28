import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
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
    TreeTableModule,
    TreeModule,
    AccordionModule
} from 'primeng/primeng';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { FormioModule } from 'angular-formio';
import { BaoCaoRoutes } from './logs.routing';
import { NgxMaskModule } from 'ngx-mask';
import { PS_COMPONENT_CONFIG } from '../config/vs-component.config';
import { VsSharedModule } from '../lib-shared/lib-shared.module';
import { LogsComponent } from './logs.component';
import { LogsService } from './logs.service';
import { LogsEditComponent } from './logs-edit/logs-edit.component';
import { AutosizeModule } from 'ngx-autosize';

export function getVsComponentConfigProvider() {
    return PS_COMPONENT_CONFIG;
}

@NgModule({
    imports: [
        BaoCaoRoutes,
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
        InputSwitchModule,
        CalendarModule,
        AutosizeModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        EditorModule,
        RadioButtonModule,
        FileUploadModule,
        ListboxModule,
        TabViewModule,
        PaginatorModule,
        TreeModule,
        MultiSelectModule,
        OverlayPanelModule,
        MenuModule,
        AutoCompleteModule,
        NgxMaskModule.forRoot({
            showMaskTyped: true,
        }),
        AccordionModule,
        TreeTableModule,
        VsSharedModule.forRoot(getVsComponentConfigProvider)
    ],
    providers: [
        LogsService,
    ],
    declarations: [
        LogsComponent,
        LogsEditComponent
    ]
})
export class LogModule { }
