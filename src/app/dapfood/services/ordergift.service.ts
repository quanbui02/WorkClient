import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class OrderGiftsService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Gift`);
    }

    Gets(key: string, type: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&type=${type}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Active(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Active', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetByOrder(key: string, idProducts: string, totalBill: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetByOrder?key=${key}&idProducts=${idProducts}&totalBill=${totalBill}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetByOrderSelected(item: any) {
        const url = `${this.serviceUri}/GetByOrderSelected`;
        return this.defaultPost(url, item);
    }
    Autocomplete(key: string, offset?: number, limit?: number) {
        const queryString = `${this.serviceUri}/Autocomplete?key=${key}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString); // '/assets/countries.json'
    }
}
