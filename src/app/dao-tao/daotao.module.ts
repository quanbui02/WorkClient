import { CoursesLessonComponent } from './Courses/Courses-lesson/Courses-lesson.component';
import { CoursesService } from './services/courses.service';
import { CoursesComponent } from './Courses/Courses.component';
import { QuestionLessonLessonDetailComponent } from './questionLessions/questionLesson-lessonDetail/questionLesson-lessonDetail.component';
import { LessonRatesLessonComponent } from './lessonRates/lessonRates-lesson/lessonRates-lesson.component';
import { QuestionLessionsEditComponent } from './questionLessions/questionLessions-edit/questionLessions-edit.component';
import { QuestionLessionsComponent } from './questionLessions/questionLessions.component';
import { QuestionLessonsService } from './services/questionLessons.service';
import { RatingModule } from 'primeng/rating';
import { DataViewModule } from 'primeng/dataview';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { AutosizeModule } from 'ngx-autosize';
import { ClipboardModule } from 'ngx-clipboard';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import { DialogService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { LessonRatesEditComponent } from './lessonRates/lessonRates-edit/lessonRates-edit.component';
import { LessonRatesComponent } from './lessonRates/lessonRates.component';
import { LessonRatesService } from './services/lessonRates.service';
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
import { PS_COMPONENT_CONFIG } from '../config/vs-component.config';
import { VsSharedModule } from '../lib-shared/lib-shared.module';
import { OrdersService } from '../dapfood/services/orders.service';
import { StatusService } from '../dapfood/services/status.service';
import { GroupsService } from '../dapfood/services/groups.service';
import { ProductService } from '../dapfood/services/products.service';
import { ClientsService } from '../dapfood/services/clients.service';
import { ShopsService } from '../dapfood/services/shops.service';
import { DaoTaoRoutes } from './daotao.routing';
import { LessonsComponent } from './lessons/lessons.component';
import { LessonsService } from './services/lessons.service';
import { LessonsEditComponent } from './lessons/lessons-edit/lessons-edit.component';
import { LessonDetailsEditComponent } from './lessons/lessondetails-edit/lessondetails-edit.component';
import { LessonDetailsService } from './services/lessondetails.service';
import { CourseLessonsService } from './services/courseLessons.service';
import { PathologiesService } from '../dapfood/services/Pathologies.service';

export function getVsComponentConfigProvider() {
    return PS_COMPONENT_CONFIG;
}

@NgModule({
    imports: [
        DaoTaoRoutes,
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
    providers: [
        OrdersService,
        StatusService,
        GroupsService,
        ProductService,
        ClientsService,
        ShopsService,
        LessonsService,
        LessonDetailsService,
        LessonRatesService,
        DialogService,
        QuestionLessonsService,
        CoursesService,
        CourseLessonsService,
        PathologiesService
    ],
    declarations: [
        LessonsComponent,
        LessonsEditComponent,
        LessonDetailsEditComponent,
        LessonRatesComponent,
        LessonRatesEditComponent,
        QuestionLessionsComponent,
        QuestionLessionsEditComponent,
        LessonRatesLessonComponent,
        QuestionLessonLessonDetailComponent,
        CoursesComponent,
        CoursesLessonComponent
    ]
})
export class DaoTaoModule { }
