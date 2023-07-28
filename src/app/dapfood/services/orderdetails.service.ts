import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class OrderDetailsService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/OrderDetails`);
    }

    Gets(idOrder: number) {
        const queryString = `${this.serviceUri}?idOrder=${idOrder}`;
        return this.defaultGet(queryString);
    }

    GetData(key: string, starRating: number, status: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&starRating=${starRating}&status=${status}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    UpdateStatusFeedbackById(id: number, status: number, note: string): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(`${this.serviceUri}/UpdateStatusFeedbackById?id=${id}&status=${status}&note=${note}`, null)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    UpdateRatingById(id: number, rating: number, comment: string): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(`${this.serviceUri}/UpdateRatingById?id=${id}&rating=${rating}&comment=${comment}`, null)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetById(id: number) {
        const queryString = `${this.serviceUri}/GetById?id=${id}`;
        return this.defaultGet(queryString);
    }

}
