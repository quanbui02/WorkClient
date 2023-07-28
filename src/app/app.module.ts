import { EventEmitterService } from './services/eventemitter.service';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutes, routes } from './app.routes';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { GalleriaModule } from 'primeng/galleria';
import { GrowlModule } from 'primeng/growl';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { AppComponent } from './app.component';
import { AppMenuComponent, AppSubMenuComponent } from './app.menu.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppProfileComponent } from './app.profile.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { OAuthModule } from 'angular-oauth2-oidc';
import { PS_COMPONENT_CONFIG } from './config/vs-component.config';
import { SignalRModule } from 'ng2-signalr';
import { signalrConfig } from './config/signalr.config';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { MessageService } from 'primeng/components/common/messageservice';
import { DatePipe } from '@angular/common';
import { QuicklinkModule } from 'ngx-quicklink';
import { UnauthorizeComponent } from './error/Unauthorize/Unauthorize.component';
import { GlobalService } from './services/global.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VsMySettingService } from './services/ccmysetting.service';
import { VsSharedModule } from './lib-shared/lib-shared.module';
import { GuardService } from './lib-shared/auth/guard.service';
import { AuthorizeService } from './lib-shared/services/authorize.service';
import { VsAuthenService } from './lib-shared/auth/authen.service';
import { RemoteStorage } from './lib-shared/services/remote-storage';
import { ProfileComponent } from './profile/profile.component';
import { MultiTranslateHttpLoader } from './lib-shared/classes/multi-translate-http-loader';
import { SendAccessTokenInterceptor } from './lib-shared/intercepters/send-access-token.interceptor';
import { StatementsService } from './dapfood/services/statements.service';
import { NgxMaskModule } from 'ngx-mask';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SignalRService } from './lib-shared/services/signalr.service';
import { BanksService } from './dapfood/services/banks.service';
import { LogSmsService } from './dapfood/services/logsms.service';
import { ProfileCmtComponent } from './profile/profile-cmt.component';
import { ProvincesService } from './dapfood/services/provinces.service';
import { DistrictsService } from './dapfood/services/districts.service';
import { WardsService } from './dapfood/services/wards.service';
import { ProfileAddressComponent } from './profile/profile-address.component';
import { UserAddressService } from './dapfood/services/useraddress.service';
import { OmiCallsService } from './lib-shared/services/omicall.service';
import { GanttModule } from '@syncfusion/ej2-angular-gantt';

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
        BrowserModule,
        FormsModule,
        AppRoutes,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        GrowlModule,
        InplaceModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScrollPanelModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        GanttModule,
        ReactiveFormsModule,
        VirtualScrollerModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        NgxMaskModule.forRoot({
            showMaskTyped: true,
        }),
        OAuthModule.forRoot({
            resourceServer: {
                allowedUrls: [environment.apiDomain.gateway],
                sendAccessToken: true
            }
        }),

        // VsComponentModule.forRoot(getVsComponentConfigProvider),
        SignalRModule.forRoot(signalrConfig),
        QuicklinkModule,
        VsSharedModule.forRoot(getVsComponentConfigProvider),

        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule
    ],
    declarations: [
        AppComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppProfileComponent,
        UnauthorizeComponent,
        ChangePasswordComponent,
        ProfileComponent,
        ProfileCmtComponent,
        ProfileAddressComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SendAccessTokenInterceptor,
            multi: true
        },
        // {
        //     provide: LocationStrategy,
        //     useClass: HashLocationStrategy
        // },
        SignalRService,
        MessageService,
        ConfirmationService,
        DatePipe,
        GlobalService,
        VsMySettingService,
        GuardService,
        StatementsService,
        VsAuthenService,
        AuthorizeService,
        GuardService,
        RemoteStorage,
        BanksService,
        LogSmsService,
        ProvincesService,
        DistrictsService,
        WardsService,
        UserAddressService,
        OmiCallsService,
        EventEmitterService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
