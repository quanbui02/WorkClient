import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ResponseResult } from '../../lib-shared/models/response-result';
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class ShopProductsService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/ShopProducts`);
    }

    Gets(key: string, idProduct: number, alter: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&idProduct=${idProduct}&alter=${alter}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    IsActive(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Active', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    PostList(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/PostList', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }
}
