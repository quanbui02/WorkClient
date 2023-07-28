import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {CheckboxModule, DropdownModule, OverlayPanelModule, RadioButtonModule, TabViewModule} from 'primeng/primeng';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {Shared_filterColTableComponent} from './component/filter-col-table/filter-col-table.component';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        DialogModule,
        RadioButtonModule,
        TabViewModule,
        TranslateModule,
        FormsModule,
        DropdownModule,
        OverlayPanelModule,
        CheckboxModule
    ],
    declarations: [
        Shared_filterColTableComponent
    ],
    exports: [ Shared_filterColTableComponent ]
})
export class QuanLyThiSharedModule {
}
