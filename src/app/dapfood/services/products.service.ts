import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class ProductService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Products`);
    }
    getDetailAll(id: any): Promise<ResponseResult> {
        const url = `${this.serviceUri}/getDetail/${id}`;
        return this.defaultGet(url);
    }

    getDetailById(id: any): Promise<ResponseResult> {
        const url = `${this.serviceUri}/GetDetailById/${id}`;
        return this.defaultGet(url);
    }

    getProducsInCombo(id: any): Promise<ResponseResult> {
        const url = `${this.serviceUri}/getProducsInCombo/${id}`;
        return this.defaultGet(url);
    }

    Autocomplete(key: string, offset?: number, limit?: number) {
        const queryString = `${this.serviceUri}/Autocomplete?key=${key}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString); // '/assets/countries.json'
    }

    // AutocompleteByClient(key: string, offset?: number, limit?: number) {
    //     const queryString = `${this.serviceUri}/AutocompleteByClient?key=${key}&offset=${offset}&limit=${limit}`;
    //     return this.defaultGet(queryString); // '/assets/countries.json'
    // }

    Approved(id: number, status: number) {
        const queryString = `${this.serviceUri}/Approved?id=${id}&status=${status}`;
        return this.defaultGet(queryString);
    }
    // GetLink(idProduct: number) {
    //     const queryString = `${this.serviceUri}/GetLink?idProduct=${idProduct}`;
    //     return this.defaultGet(queryString);
    // }
    GetsForApprove(key: string, idCategory?: number, idClient?: number, adminApprove?: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetsForApprove?key=${key}&idCategory=${idCategory}&idClient=${idClient}&adminApprove=${adminApprove}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    Gets(key: string, idClient?: number, adminApprove?: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&idClient=${idClient}&adminApprove=${adminApprove}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    GetsByIdClient(key: string, status?: number, active?: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetsByIdClient?key=${key}&status=${status}&active=${active}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    GetForCampaign(offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetForCampaign?offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    ProductStatisticsOrderByCTV(userId: number, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        let tDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        if (toDate) {
            tDate = toDate.toISOString();
        }

        const queryString = `${this.serviceUri}/ProductStatisticsOrderByCTV?userId=${userId}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    // SearchForReg(key: string, category: number, status: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
    //     const queryString = `${this.serviceUri}/SearchForReg?key=${key}&category=${category}&status=${status}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
    //     return this.defaultGet(queryString);
    // }
    Search(key: string, category: number, brand: number, idClient: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/Search?key=${key}&category=${category}&brand=${brand}&idClient=${idClient}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    SynData(searchData: any): Promise<ResponseResult> {
        const queryString = `${this.serviceUri}/SynData`;
        return this._http
            .post<ResponseResult>(queryString, searchData)
            .pipe(catchError(err => this.handleError(err, this._injector)))
            .toPromise();
    }
    ConfigProducts(products: any): any {
        const queryString = `${this.serviceUri}/ConfigProducts`;
        return this._http
            .post<ResponseResult>(queryString, products)
            .pipe(catchError(err => this.handleError(err, this._injector)))
            .toPromise();
    }
    SaveRate(searchData: any): Promise<ResponseResult> {
        const queryString = `${this.serviceUri}/SaveRate`;
        return this._http
            .post<ResponseResult>(queryString, searchData)
            .pipe(catchError(err => this.handleError(err, this._injector)))
            .toPromise();
    }
    SaveComment(data: string): Promise<ResponseResult> {
        const queryString = `${this.serviceUri}/SaveComment`;
        return this._http
            .post<ResponseResult>(queryString, data)
            .pipe(catchError(err => this.handleError(err, this._injector)))
            .toPromise();
    }

    IsSoldOut(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/IsSoldOut', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    IsActive(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/IsActive', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }
}
