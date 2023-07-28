import { NgModule, ModuleWithProviders, TemplateRef } from '@angular/core';
import { NgbTooltipModule, NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { VsModuleConfig } from './models/module-config';
import { ModuleConfigService, moduleConfigFunc } from './services/module-config.service';
import {
    FileUploadModule,
    DropdownModule,
    TooltipModule,
    MultiSelectModule,
    AutoCompleteModule,
    CalendarModule,
    DialogModule,
    ScrollPanelModule,
    BreadcrumbModule,
    LightboxModule
} from 'primeng/primeng';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VsPrintOnDebugPipe } from './pipes/print-object.pipe';
import { VsQueryStringService } from './services/query-string.service';
import { DateOnlyDirective } from './directives/date-only.directive';
import { VsCommonService } from './services/vs-common.service';
import { VsThongBaoService } from './services/vs-thongbao.service';
import { VsApplicationManagementService } from './services/application-management.service';
import { VsDateTimePipe, VsDatePipe } from './pipes/date.pipe';

import { ShowDefaultImageOnErrorDirective } from './directives/show-default-image-on-error.directive';
import { RouterModule } from '@angular/router';
import { ConfirmDirective } from './directives/confirm.directive';
import { AccountTypePipe } from './pipes/account-type.pipe';
import { ApprovalPipe } from './pipes/approval.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { VsUserRolePipe } from './pipes/user-role.pipe';
import { TNThietLapCauHinhService } from './services/cau-hinh-thiet-lap.service';
import { ConfirmSwalDirective } from './directives/confirm-swal.directive';
import { ErrorInterceptor } from './intercepters/error-intercepter';
// import { AuthorizationIntercepter } from './auth/authorization-intercepter';
import { ConfigurationService } from './services/configuration.service';
// import { PhanTramPipe } from 'lib-shared';
import { LogSessionIntercepter } from './intercepters/log-session.intercepter';
import { AuthorizeDirective } from './directives/authorize.directive';
import { VsSingleFsFileUploadComponent } from './components/fs-upload/single-file-upload/single-file-upload.component';
import { VsFsFolderPickerComponent } from './components/fs-upload/fs-folder-picker/fs-folder-picker.component';
import { VsFsMultiFileUploadComponent } from './components/fs-upload/multi-file-upload/multi-file-upload.component';
import { VsFsFileUploadService } from './components/fs-upload/services/file-upload.service';
import { BreadcrumbComponent } from './components/fs-upload/breadcrumb/breadcrumb.component';
import { FileManagerPopupComponent } from './components/fs-upload/file-manager-popup/file-manager-popup.component';
import { FileViewerComponent } from './components/fs-upload/file-viewer/file-viewer.component';
import { TNSelectFileOnServerComponent } from './components/fs-upload/select-file-onserver/select-file-onserver.component';
import { VsMultiUploadComponent } from './components/fs-upload/multi-upload/multi-upload.component';
import { VsThumbnailComponent } from './components/file-upload/thumbnail/thumbnail.component';
import { VsSingleFileUploadComponent } from './components/file-upload/single-file-upload/single-file-upload.component';
import { VsMultiFileUploadComponent } from './components/file-upload/multi-file-upload/multi-file-upload.component';
import { VsListFileComponent } from './components/file-upload/list-file/list-file.component';
import { TableModule } from 'primeng/table';
import { VsFileUploadService } from './components/file-upload/services/file-upload.service';
import { AuthorizationIntercepter } from './intercepters/authorization-intercepter';
import { VsFsListFileComponent } from './components/fs-upload/list-file/list-file.component';
import { VsFsListImageComponent } from './components/fs-upload/list-image/list-image.component';
import { ValidationSummaryComponent } from './components/validation-summary/validation-summary.component';
import { VsAppNotificationComponent } from './components/app-notification/app-notification.component';
import { BlockableDivComponent } from './components/blockable/blockable-div/blockable-div.component';
import { BooleanFormatPipe } from './pipes/boolean-format.pipe';
import { ConvertMoneyToWordPipe } from './pipes/convertMoneyToWord.pipe';
import { FileIconPipe } from './pipes/file-icon.pipe';
import { HighlightSearchPipe } from './pipes/highlight.pipe';
import { StringFormatPipe } from './pipes/string-format.pipe';
import { SummaryPipe } from './pipes/summary.pipe';
import { TrangThaiPipe } from './pipes/trangThai.pipe';
import { VsFileSizePipe, VsGetRawFileNamePipe } from './pipes/file-size.pipe';
import { NotificationService } from './services/notification.service';
import { VsMultiFileUpload2Component } from './components/fs-upload/multi-file-upload2/multi-file-upload2.component';
import { UserService } from './services/user.service';
import { VsViewImageComponent } from './components/file-upload/view-image/view-image.component';
import { CustomRouterService } from './services/custom-router.service';
import { TopicUsersService } from './services/topicusers.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutofocusDirective } from './directives/autofocus.directive';
import { FoldersService } from './components/fs-upload/services/folders.service';
import { FilesService } from './components/fs-upload/services/files.service';
import { SafePipe } from './pipes/safe.pipe';
import { VsMultiFileUploadFbStyleComponent } from './components/fs-upload/multi-file-upload-fbstyle/multi-file-upload-fbstyle.component';
import { VsNumberPipe } from './pipes/vs-number.pipe';
import { OutsideClickDirective } from './directives/outsite-click.directive';

export function coreDeclarations() {
    return [
        VsPrintOnDebugPipe,
        VsDateTimePipe,
        VsDatePipe,
        VsUserRolePipe,
        DateOnlyDirective,
        AutofocusDirective,
        ShowDefaultImageOnErrorDirective,
        ConfirmDirective,
        ConfirmSwalDirective,
        AccountTypePipe,
        ApprovalPipe,
        AuthorizeDirective,
        VsSingleFsFileUploadComponent,
        VsFsFolderPickerComponent,
        VsFsMultiFileUploadComponent,
        FileViewerComponent,
        BreadcrumbComponent,
        FileManagerPopupComponent,
        TNSelectFileOnServerComponent,
        VsMultiUploadComponent,
        VsThumbnailComponent,
        VsSingleFileUploadComponent,
        VsMultiFileUploadComponent,
        VsMultiFileUpload2Component,
        VsMultiFileUploadFbStyleComponent,
        VsListFileComponent,
        VsFsListFileComponent,
        VsFsListImageComponent,
        ValidationSummaryComponent,
        VsAppNotificationComponent,
        BlockableDivComponent,
        BooleanFormatPipe,
        ConvertMoneyToWordPipe,
        FileIconPipe,
        VsFileSizePipe,
        VsGetRawFileNamePipe,
        HighlightSearchPipe,
        StringFormatPipe,
        SummaryPipe,
        SafePipe,
        TrangThaiPipe,
        VsViewImageComponent,
        VsNumberPipe,
        OutsideClickDirective
    ];
}

export function coreProviders() {
    return [
        TopicUsersService,
        CustomRouterService,
        UserService,
        NotificationService,
        VsFileUploadService,
        ConfigurationService,
        ModuleConfigService,
        VsQueryStringService,
        VsCommonService,
        VsThongBaoService,
        VsApplicationManagementService,
        TNThietLapCauHinhService,
        VsFsFileUploadService,
        FoldersService,
        FilesService,
        // NotifierService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LogSessionIntercepter,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthorizationIntercepter,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ];
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
        FileUploadModule,
        TooltipModule,
        MultiSelectModule,
        AutoCompleteModule,
        NgbTooltipModule,
        NgbCollapseModule,
        CalendarModule,
        NgbModule,
        DialogModule,
        TableModule,
        ScrollPanelModule,
        BreadcrumbModule,
        InfiniteScrollModule,
        LightboxModule
    ],
    declarations: coreDeclarations(),
    exports: coreDeclarations(),
    providers: coreProviders()
})
export class VsSharedModule {
    static forRoot(config?: any): ModuleWithProviders {
        return {
            ngModule: VsSharedModule,
            providers: [
                {
                    provide: moduleConfigFunc,
                    useValue: config
                }
            ]
        };
    }
}
