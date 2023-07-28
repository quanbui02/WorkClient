import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ResponseResult } from '../../lib-shared/models/response-result';
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class ShopInOutsService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/ShopInOuts`);
    }

    Gets(key: string, idProduct: number, type: number, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: Number = 0) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}?key=${key}&idProduct=${idProduct}&type=${type}&fromDate=${fromDate}&toDate=${toDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${(isAsc == 1 ? true : false)}`;
        return this.defaultGet(queryString);
    }

    GetDetailPrint(ids: string) {
        const queryString = `${this.serviceUri}?ids=${ids}`;
        return this.defaultGet(queryString);
    }

    IsActive(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Active', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }
}
