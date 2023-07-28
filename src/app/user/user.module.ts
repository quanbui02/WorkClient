import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { VsSharedModule } from '../lib-shared/lib-shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
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
    TooltipModule,
    DialogModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { FormioModule } from 'angular-formio';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { VsConfirmBoxService } from '../lib-shared/services/vs-confirm-box.service';
import { UserRoutes } from './user.routing';
import { UserRoleService } from './user-role.service';
import { UserChangePwdComponent } from './changepwd/user-changepwd.component';
import { UserIndexComponent } from './index/user-index.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { AppRolesService } from '../services/approles.service';
import { MultiTranslateHttpLoader } from '../lib-shared/classes/multi-translate-http-loader';
import { PS_COMPONENT_CONFIG } from '../config/vs-component.config';
import { UserEditComponent } from './edit/user-edit.component';
import { UserCTVIndexComponent } from './ctv-index/user-ctv-index.component';
import { UserOmicallComponent } from './omicall/user-omicall.component';
import { OmiCallsService } from '../lib-shared/services/omicall.service';

export function createTranslateLoader(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' }
    ]);
}
export function getVsComponentConfigProvider() {
    return PS_COMPONENT_CONFIG;
}
@NgModule({
    imports: [
        DialogModule,
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
        TableModule,
        TooltipModule,
        CommonModule,
        NgbModule,
        SweetAlert2Module.forRoot(),
        RouterModule.forChild(UserRoutes),
        ReactiveFormsModule,
        FormsModule,
        FormioModule,
        UiSwitchModule,
        AngularDualListBoxModule,
        FilterPipeModule,
        VsSharedModule.forRoot(getVsComponentConfigProvider),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
    ],
    providers: [
        UserRoleService,
        AppRolesService,
        VsConfirmBoxService,
        OmiCallsService
    ],
    declarations: [
        UserEditComponent,
        UserChangePwdComponent,
        UserIndexComponent,
        UserRoleComponent,
        UserCTVIndexComponent,
        UserOmicallComponent,
    ]
})

export class UserModule { }
