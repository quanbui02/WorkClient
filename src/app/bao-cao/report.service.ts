import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../lib-shared/services/base.service';
import { environment } from '../../environments/environment';


@Injectable()
export class ReportService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Report`);
    }

    ReportDSDN(key: string, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/ReportDSDN?key=${key}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    ReportDSCTV(key: string, fromDate: Date, toDate: Date, fromUpdate: Date, toUpdate: Date, idProducts: string, idGroup: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        let fUpdate;
        if (fromUpdate) {
            fUpdate = fromUpdate.toISOString();
        }
        let tUpdate;
        if (toUpdate) {
            tUpdate = toUpdate.toISOString();
        }
        const queryString = `${this.serviceUri}/ReportDSCTV?key=${key}&fromDate=${fDate}&toDate=${tDate}&fromUpdate=${fUpdate}&toUpdate=${tUpdate}&idProducts=${idProducts}&idGroup=${idGroup}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    ReportByGroup(key: string, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/ReportByGroup?key=${key}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    BaoCaoDoanhSoCSKH(fromDate: Date, toDate: Date) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_BaoCaoDoanhSoCSKH?fromDate=${fDate}&toDate=${tDate}`;
        return this.defaultGet(queryString);
    }

    ReportDSNhom(key: string, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/ReportDSNhom?key=${key}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Products(key: string, fromDate: Date, toDate: Date, idClient?: number, adminApprove?: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Products?key=${key}&fromDate=${fDate}&toDate=${tDate}&idClient=${idClient}&adminApprove=${adminApprove}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Report_Client_BaoCaoDonHang(fromDate: Date, toDate: Date) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_Client_BaoCaoDonHang?fromDate=${fDate}&toDate=${tDate}`;
        return this.defaultGet(queryString);
    }

    Report_BaoCaoBanHangCTVTheoSanPham(fromDate: Date, toDate: Date) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_BaoCaoBanHangCTVTheoSanPham?fromDate=${fDate}&toDate=${tDate}`;
        return this.defaultGet(queryString);
    }

    Report_BaoCaoBanHangDNTheoSanPham(fromDate: Date, toDate: Date, sortField: string, isAsc: boolean) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_BaoCaoBanHangDNTheoSanPham?fromDate=${fDate}&toDate=${tDate}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Report_BaoCaoBanHangDNTheoTrangThai(fromDate: Date, toDate: Date) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_BaoCaoBanHangDNTheoTrangThai?fromDate=${fDate}&toDate=${tDate}`;
        return this.defaultGet(queryString);
    }

    Report_BaoCaoTonKhoCuaHang(idProvince: number, idShop: number, sortField: string, isAsc: boolean) {
        const queryString = `${this.serviceUri}/Report_BaoCaoTonKhoCuaHang?IdProvince=${idProvince}&IdShop=${idShop}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Report_BaoCaoBanHangTheoCuaHang(idProvince: number, fromDate: Date, toDate: Date, sortField: string, isAsc: boolean) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_BaoCaoBanHangTheoCuaHang?idProvince=${idProvince}&fromDate=${fDate}&toDate=${tDate}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Report_Client_BaoCaoChiTietDonHang(fromDate: Date, toDate: Date) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_Client_BaoCaoChiTietDonHang?fromDate=${fDate}&toDate=${tDate}`;
        return this.defaultGet(queryString);
    }

    Report_BaoCaoKhachHangDonHang(key: string, idProvince: number, idShop: number, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_BaoCaoKhachHangDonHang?key=${key}&idProvince=${idProvince}&idShop=${idShop}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    // GetDashboardDN() {
    //     const queryString = `${this.serviceUri}/GetDashboardDN`;
    //     return this.defaultGet(queryString);
    // }

    Report_chart_DonHang(dateType: number, idProvince: number, idShop: number) {
        const queryString = `${this.serviceUri}/Report_chart_DonHang?dateType=${dateType}&idProvince=${idProvince}&idShop=${idShop}`;
        return this.defaultGet(queryString);
    }
}

