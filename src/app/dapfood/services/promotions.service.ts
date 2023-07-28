import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class PromotionsService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Promotions`);
    }

    Gets(key: string, type: number, isActive: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&type=${type}&isActive=${isActive}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Active(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Active', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetByOrder(key: string, idProducts: string, quantity: number, totalBill: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetByOrder?key=${key}&idProducts=${idProducts}&quantity=${quantity}&totalBill=${totalBill}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetListUserUsedById(idPromotion: number, offset?: number, limit?: number) {
        const queryString = `${this.serviceUri}/GetListUserUsedById?idPromotion=${idPromotion}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString);
    }

    GetByOrderSelected(item: any) {
        const url = `${this.serviceUri}/GetByOrderSelected`;
        return this.defaultPost(url, item);
    }

    GetShort(id: number) {
        const url = `${this.serviceUri}/GetShort?id=${id}`;
        return this.defaultGet(url);
    }

    Autocomplete(key: string, offset?: number, limit?: number) {
        const queryString = `${this.serviceUri}/Autocomplete?key=${key}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString); // '/assets/countries.json'
    }

    deleteAll(id: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/deleteAll/${id}`;
        return this._http
            .delete<ResponseResult>(url)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetForEdit(id: number) {
        const url = `${this.serviceUri}/GetForEdit?id=${id}`;
        return this.defaultGet(url);
    }

}
