import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ResponseResult } from '../../lib-shared/models/response-result';
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class ShopsService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Shops`);
    }

    Active(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Active', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    Open(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Open', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    Show(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Show', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetByUserId(): Promise<ResponseResult> {
        const url = `${this.serviceUri}/GetByUserId`;
        return this.defaultGet(url);
    }

    GetByIdClient(idClient: string, isDc: number, idDC: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/GetByIdClient?idClient=${idClient}&isDc=${isDc}&idDC=${idDC}`;
        return this.defaultGet(url);
    }

    GetShortByLocation(isDc: number, idProvince: number, idDistrict: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/GetShortByLocation?isDc=${isDc}&idProvince=${idProvince}&idDistrict=${idDistrict}`;
        return this.defaultGet(url);
    }

    //isDC: 1 is DC, 0 is not DC
    GetShortByLocationSelect(isDc: number, idProvince: number, idDistrict: number, idWard: number, idShop: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/GetShortByLocationSelect?isDc=${isDc}&idProvince=${idProvince}&idDistrict=${idDistrict}&idWard=${idWard}&idShop=${idShop}`;
        return this.defaultGet(url);
    }

    Gets(key: string, idProvince: number, idClient: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&idProvince=${idProvince}&idClient=${idClient}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetShort(key: string, isDC: number, idDC: number) {
        const queryString = `${this.serviceUri}/GetShort?key=${key}&isDC=${isDC}&idDC=${idDC}`;
        return this.defaultGet(queryString);
    }

    ShowDeliveryDate(item: any) {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/ShowDeliveryDate', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetLocationShop(item: any) {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/GetLocationShop', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetByToken(): Promise<ResponseResult> {
        const url = `${this.serviceUri}/GetByToken`;
        return this.defaultGet(url);
    }

    UpdateInfo(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/UpdateInfo', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetShopHistories(idProduct: number, idObject: number, type: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetShopHistories?idProduct=${idProduct}&idObject=${idObject}&type=${type}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
}
