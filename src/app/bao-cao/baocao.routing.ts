import { RouterModule, Routes } from '@angular/router';
import { DoiSoatDoanhNghiepComponent } from './doi-soat-doanh-nghiep/doi-soat-doanh-nghiep.component';
import { GuardService } from '../lib-shared/auth/guard.service';
import { DoiSoatCtvComponent } from './doi-soat-ctv/doi-soat-ctv.component';
import { BaoCaoNhomTheoCtvComponent } from './bao-cao-nhom-theo-ctv/bao-cao-nhom-theo-ctv.component';
import { ReportClientBaoCaoDonHangComponent } from './ReportClientBaoCaoDonHang/ReportClientBaoCaoDonHang.component';
import { ReportClientBaoCaoChiTietDonHangComponent } from './ReportClientBaoCaoChiTietDonHang/ReportClientBaoCaoChiTietDonHang.component';
import { ThongKeTheoSanPhamComponent } from './thong-ke-theo-san-pham/thong-ke-theo-san-pham.component';
import { BanHangCTVTheoSanPhamComponent } from './ban-hang-ctv-theo-san-pham/ban-hang-ctv-theo-san-pham.component';
import { BanHangDNTheoSanPhamComponent } from './ban-hang-dn-theo-san-pham/ban-hang-dn-theo-san-pham.component';
import { BanHangDNTheoTrangThaiComponent } from './ban-hang-dn-theo-trang-thai/ban-hang-dn-theo-trang-thai.component';
import { BaoCaoDoanhSoCSKHComponent } from "./bao-cao-doanh-so-cskh/bao-cao-doanh-so-cskh.component";
import { BaoCaoTonKhoCuaHangComponent } from "./bao-cao-ton-kho-cua-hang/bao-cao-ton-kho-cua-hang.component";
import { BaoCaoDonHangKhachHangComponent } from "./bao-cao-don-hang-khach-hang/bao-cao-don-hang-khach-hang.component";
import { BaoCaoBanHangTheoCuaHangComponent } from "./bao-cao-ban-hang-theo-cua-hang/bao-cao-ban-hang-theo-cua-hang.component";
import { ThongKeDonHangComponent } from './thong-ke-don-hang/thong-ke-don-hang.component';
import { ThongKeDonHangTheoCuaHangComponent } from './thong-ke-don-hang-theo-cua-hang/thong-ke-don-hang-theo-cua-hang.component';
import { ThongKeDonHangTheoKhuVucComponent } from './thong-ke-don-hang-theo-khu-vuc/thong-ke-don-hang-theo-khu-vuc.component';
import { ThongKeDonHangTheoKenhThanhToanComponent } from './thong-ke-don-hang-theo-kenh-thanh-toan/thong-ke-don-hang-theo-kenh-thanh-toan.component';

const routes: Routes = [
    {
        path: 'doi-soat-doanh-nghiep',
        canActivate: [GuardService],
        component: DoiSoatDoanhNghiepComponent
    },
    {
        path: 'doi-soat-ctv',
        canActivate: [GuardService],
        component: DoiSoatCtvComponent
    },
    {
        path: 'bao-cao-nhom-theo-ctv',
        canActivate: [GuardService],
        component: BaoCaoNhomTheoCtvComponent
    },
    {
        path: 'thong-ke-theo-san-pham',
        canActivate: [GuardService],
        component: ThongKeTheoSanPhamComponent
    },
    {
        path: 'thong-ke-theo-don-hang',
        canActivate: [GuardService],
        component: ReportClientBaoCaoDonHangComponent
    },
    {
        path: 'chi-tiet-don-hang',
        canActivate: [GuardService],
        component: ReportClientBaoCaoChiTietDonHangComponent
    },
    {
        path: 'ban-hang-ctv-theo-san-pham',
        canActivate: [GuardService],
        component: BanHangCTVTheoSanPhamComponent
    },
    {
        path: 'ban-hang-dn-theo-san-pham',
        canActivate: [GuardService],
        component: BanHangDNTheoSanPhamComponent
    },
    {
        path: 'ban-hang-dn-theo-trang-thai',
        canActivate: [GuardService],
        component: BanHangDNTheoTrangThaiComponent
    },
    {
        path: 'bao-cao-doanh-so-cskh',
        canActivate: [GuardService],
        component: BaoCaoDoanhSoCSKHComponent
    },
    {
        path: 'bao-cao-ton-kho-cua-hang',
        canActivate: [GuardService],
        component: BaoCaoTonKhoCuaHangComponent
    },
    {
        path: 'bao-cao-don-hang-khach-hang',
        canActivate: [GuardService],
        component: BaoCaoDonHangKhachHangComponent
    },
    {
        path: 'bao-cao-ban-hang-theo-cua-hang',
        canActivate: [GuardService],
        component: BaoCaoBanHangTheoCuaHangComponent
    },
    {
        path: 'thong-ke-don-hang',
        canActivate: [GuardService],
        component: ThongKeDonHangComponent
    },
    {
        path: 'thong-ke-don-hang-theo-cua-hang',
        canActivate: [GuardService],
        component: ThongKeDonHangTheoCuaHangComponent
    },
    {
        path: 'thong-ke-don-hang-theo-khu-vuc',
        canActivate: [GuardService],
        component: ThongKeDonHangTheoKhuVucComponent
    },
    {
        path: 'thong-ke-don-hang-theo-kenh-thanh-toan',
        canActivate: [GuardService],
        component: ThongKeDonHangTheoKenhThanhToanComponent
    }
];

export const BaoCaoRoutes = RouterModule.forChild(routes);
