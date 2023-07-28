import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class OrdersMessageService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.logEndPoint}/OrdersMessage`);
    }

    Gets(key: string, isActive: number, idShop: number, idProvince: number, idStatus: number, fromDate: Date, toDate: Date, idProduct: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        let tDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}?key=${key}&isActive=${isActive}&idShop=${idShop}&idProvince=${idProvince}&idStatus=${idStatus}&toDate=${tDate}&fromDate=${fDate}&idProduct=${idProduct}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    ReportOrdersMessageByCustomer(key: string, isActive: number, idShop: number, idProvince: number, idStatus: number, fromDate: Date, toDate: Date, idProduct: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        let tDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_OrdersMessageByCustomer?key=${key}&isActive=${isActive}&idShop=${idShop}&idProvince=${idProvince}&idStatus=${idStatus}&toDate=${tDate}&fromDate=${fDate}&idProduct=${idProduct}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    ReportOrdersMessageByProduct(key: string, isActive: number, idShop: number, idProvince: number, idStatus: number, fromDate: Date, toDate: Date, idProduct: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        let tDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_OrdersMessageByProduct?key=${key}&isActive=${isActive}&idShop=${idShop}&idProvince=${idProvince}&idStatus=${idStatus}&toDate=${tDate}&fromDate=${fDate}&idProduct=${idProduct}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    ReportOrdersMessageByShop(key: string, isActive: number, idShop: number, idProvince: number, idStatus: number, fromDate: Date, toDate: Date, idProduct: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        let tDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_OrdersMessageByShop?key=${key}&isActive=${isActive}&idShop=${idShop}&idProvince=${idProvince}&idStatus=${idStatus}&toDate=${tDate}&fromDate=${fDate}&idProduct=${idProduct}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    ReportOrdersMessageByShopProduct(key: string, isActive: number, idShop: number, idProvince: number, idStatus: number, fromDate: Date, toDate: Date, idProduct: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        let tDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_OrdersMessageByShopProduct?key=${key}&isActive=${isActive}&idShop=${idShop}&idProvince=${idProvince}&idStatus=${idStatus}&toDate=${tDate}&fromDate=${fDate}&idProduct=${idProduct}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Active(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Active', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    UpdateStatus(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/UpdateStatus', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetById(id: number) {
        const queryString = `${this.serviceUri}/GetById?id=${id}`;
        return this.defaultGet(queryString);
    }
}
