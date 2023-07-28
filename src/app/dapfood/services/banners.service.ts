import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class BannersService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(
            http,
            injector,
            `${environment.apiDomain.dapFoodEndPoint}/Banners`
        );
    }
    Gets(key: string, cate: number, isActive: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&cate=${cate}&isActive=${isActive}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Active(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Active', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    IsShowHome(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/IsShowHome', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }
}
