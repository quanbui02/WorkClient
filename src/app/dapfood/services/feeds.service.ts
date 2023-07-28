import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';


@Injectable()
export class FeedsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Feeds`);
    }

    List(key: string, isActived: number, pin: number, offset?: number, limit?: number, sortField?: string, isAsc = false) {
        const queryString = `${this.serviceUri}/List?key=${key}&isActived=${isActived}&pin=${pin}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Active(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Active', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }


    Pin(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Pin', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    onDeleteAdmin(id: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/Admin/${id}`;
        return this._http
            .delete<ResponseResult>(url)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

}

