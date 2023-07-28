import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../lib-shared/services/base.service';
import { environment } from '../../environments/environment';

@Injectable()
export class StatisticsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Statistics`);
    }

    Report_chart_DonHang(dateType: number, yearNumber: number, monthNumber: number, idProvince: number, idShop: number) {
        const queryString = `${this.serviceUri}/Report_chart_DonHang?dateType=${dateType}&yearNumber=${yearNumber}&monthNumber=${monthNumber}&idProvince=${idProvince}&idShop=${idShop}`;
        return this.defaultGet(queryString);
    }
    Report_chart_Order_Shop(dateType: number, idProvince: number) {
        const queryString = `${this.serviceUri}/Report_chart_Order_Shop?dateType=${dateType}&idProvince=${idProvince}`;
        return this.defaultGet(queryString);
    }
    Report_chart_Order_Provinces(dateType: number) {
        const queryString = `${this.serviceUri}/Report_chart_Order_Provinces?dateType=${dateType}`;
        return this.defaultGet(queryString);
    }
    Report_chart_Order_PaymentChannel(dateType: number) {
        const queryString = `${this.serviceUri}/Report_chart_Order_PaymentChannel?dateType=${dateType}`;
        return this.defaultGet(queryString);
    }
}

