import { DeliveryServiceEditComponent } from './delivery-service/delivery-service-edit/delivery-service-edit.component';
import { DeliveriesService } from './services/deliveries.service';
import { DeliveryServiceComponent } from './delivery-service/delivery-service.component';
import { RatingModule } from 'primeng/rating';
import { DataViewModule } from 'primeng/dataview';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { AutosizeModule } from 'ngx-autosize';
import { ClipboardModule } from 'ngx-clipboard';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import { DialogService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { TreeTableModule } from 'primeng/treetable';
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
    AccordionModule,
    SelectButtonModule,
    ProgressSpinnerModule
} from 'primeng/primeng';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { FormioModule } from 'angular-formio';
import { NgxMaskModule } from 'ngx-mask';
import { DeliveryCategoriesEditComponent } from './delivery-categories/delivery-categories-edit/DeliveryCategories-edit.component';
import { DeliveryCategoriesComponent } from './delivery-categories/DeliveryCategories.component';
import { PS_COMPONENT_CONFIG } from '../../config/vs-component.config';
import { DeliveryRoutes } from './delivery.routing';
import { OrdersService } from '../services/orders.service';
import { StatusService } from '../services/status.service';
import { GroupsService } from '../services/groups.service';
import { ProductService } from '../services/products.service';
import { ClientsService } from '../services/clients.service';
import { ShopsService } from '../services/shops.service';
import { VsSharedModule } from '../../lib-shared/lib-shared.module';
import { DeliveryCategoriesService } from './services/deliverycategories.service';
import { UserService } from '../../lib-shared/services/user.service';

export function getVsComponentConfigProvider() {
    return PS_COMPONENT_CONFIG;
}

@NgModule({
    imports: [
        DeliveryRoutes,
        TranslateModule,
        CommonModule,
        DialogModule,
        ButtonModule,
        PanelModule,
        RatingModule,
        ConfirmDialogModule,
        FieldsetModule,
        CheckboxModule,
        ToastModule,
        SplitButtonModule,
        TableModule,
        FieldsetModule,
        TooltipModule,
        ReactiveFormsModule,
        FormsModule,
        FormioModule,
        InputSwitchModule,
        CalendarModule,
        DropdownModule,
        InputTextModule,
        SelectButtonModule,
        DynamicDialogModule,
        InputTextareaModule,
        EditorModule,
        RadioButtonModule,
        FileUploadModule,
        ListboxModule,
        ContextMenuModule,
        TabViewModule,
        PaginatorModule,
        TreeModule,
        MultiSelectModule,
        ProgressSpinnerModule,
        OverlayPanelModule,
        MenuModule,
        AutosizeModule,
        AutoCompleteModule,
        NgxMaskModule.forRoot({
            showMaskTyped: true,
        }),
        AccordionModule,
        TreeTableModule,
        ClipboardModule,
        VsSharedModule.forRoot(getVsComponentConfigProvider),
        // GMapModule,
        AngularDualListBoxModule,
        DataViewModule,
    ],
    entryComponents: [
        DeliveryCategoriesEditComponent,
        // DeliveryServiceEditComponent
    ],
    providers: [
        OrdersService,
        StatusService,
        GroupsService,
        ProductService,
        ClientsService,
        ShopsService,
        DialogService,
        DeliveryCategoriesService,
        DeliveriesService,
        ShopsService,
        UserService
    ],
    declarations: [
        DeliveryCategoriesComponent,
        DeliveryCategoriesEditComponent,
        DeliveryServiceComponent,
        DeliveryServiceEditComponent
    ]
})
export class DeliveryModule { }
