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
    SelectButtonModule
} from 'primeng/primeng';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { FormioModule } from 'angular-formio';
import { BaoCaoRoutes } from './baocao.routing';
import { NgxMaskModule } from 'ngx-mask';
import { DoiSoatDoanhNghiepComponent } from './doi-soat-doanh-nghiep/doi-soat-doanh-nghiep.component';
import { PS_COMPONENT_CONFIG } from '../config/vs-component.config';
import { VsSharedModule } from '../lib-shared/lib-shared.module';
import { OrdersService } from '../dapfood/services/orders.service';
import { StatusService } from '../dapfood/services/status.service';
import { ReportService } from './report.service';
import { DoiSoatCtvComponent } from './doi-soat-ctv/doi-soat-ctv.component';
import { BaoCaoNhomTheoCtvComponent } from './bao-cao-nhom-theo-ctv/bao-cao-nhom-theo-ctv.component';
import { GroupsService } from '../dapfood/services/groups.service';
import { ProductService } from '../dapfood/services/products.service';
import { ClientsService } from '../dapfood/services/clients.service';
import { ShopsService } from '../dapfood/services/shops.service';
import { ReportClientBaoCaoDonHangComponent } from './ReportClientBaoCaoDonHang/ReportClientBaoCaoDonHang.component';
import { ReportClientBaoCaoChiTietDonHangComponent } from './ReportClientBaoCaoChiTietDonHang/ReportClientBaoCaoChiTietDonHang.component';
import { ThongKeTheoSanPhamComponent } from './thong-ke-theo-san-pham/thong-ke-theo-san-pham.component';
import { BanHangCTVTheoSanPhamComponent } from "./ban-hang-ctv-theo-san-pham/ban-hang-ctv-theo-san-pham.component";
import { BanHangDNTheoSanPhamComponent } from "./ban-hang-dn-theo-san-pham/ban-hang-dn-theo-san-pham.component";
import { BanHangDNTheoTrangThaiComponent } from "./ban-hang-dn-theo-trang-thai/ban-hang-dn-theo-trang-thai.component";
import { BaoCaoDoanhSoCSKHComponent } from "./bao-cao-doanh-so-cskh/bao-cao-doanh-so-cskh.component";
import { BaoCaoTonKhoCuaHangComponent } from "./bao-cao-ton-kho-cua-hang/bao-cao-ton-kho-cua-hang.component";
import { BaoCaoDonHangKhachHangComponent } from "./bao-cao-don-hang-khach-hang/bao-cao-don-hang-khach-hang.component";
import { BaoCaoBanHangTheoCuaHangComponent } from "./bao-cao-ban-hang-theo-cua-hang/bao-cao-ban-hang-theo-cua-hang.component";
import { ThongKeDonHangComponent } from './thong-ke-don-hang/thong-ke-don-hang.component';
import { StatisticsService } from './statistic.service';
import { ThongKeDonHangTheoCuaHangComponent } from './thong-ke-don-hang-theo-cua-hang/thong-ke-don-hang-theo-cua-hang.component';
import { ThongKeDonHangTheoKhuVucComponent } from './thong-ke-don-hang-theo-khu-vuc/thong-ke-don-hang-theo-khu-vuc.component';
import { ThongKeDonHangTheoKenhThanhToanComponent } from './thong-ke-don-hang-theo-kenh-thanh-toan/thong-ke-don-hang-theo-kenh-thanh-toan.component';

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
        SelectButtonModule,
        NgxMaskModule.forRoot({
            showMaskTyped: true,
        }),
        AccordionModule,
        TreeTableModule,
        VsSharedModule.forRoot(getVsComponentConfigProvider)
    ],
    providers: [
        OrdersService,
        StatusService,
        ReportService,
        GroupsService,
        ProductService,
        ClientsService,
        ShopsService,
        StatisticsService
    ],
    declarations: [
        DoiSoatDoanhNghiepComponent,
        DoiSoatCtvComponent,
        BaoCaoNhomTheoCtvComponent,
        ThongKeTheoSanPhamComponent,
        ReportClientBaoCaoDonHangComponent,
        ReportClientBaoCaoChiTietDonHangComponent,
        BanHangCTVTheoSanPhamComponent,
        BanHangDNTheoSanPhamComponent,
        BanHangDNTheoTrangThaiComponent,
        BaoCaoDoanhSoCSKHComponent,
        BaoCaoTonKhoCuaHangComponent,
        BaoCaoDonHangKhachHangComponent,
        BaoCaoBanHangTheoCuaHangComponent,
        ThongKeDonHangComponent,
        ThongKeDonHangTheoCuaHangComponent,
        ThongKeDonHangTheoKhuVucComponent,
        ThongKeDonHangTheoKenhThanhToanComponent
    ]
})
export class BaoCaoModule { }
