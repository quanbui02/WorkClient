import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class FeedbacksService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/feedbacks`);
    }
    Gets(key: string, cateId: number, statusId: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&cateId=${cateId}&statusId=${statusId}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetById(id: number) {
        const queryString = `${this.serviceUri}/${id}`;
        return this.defaultGet(queryString);
    }

    UpdateStatus(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/UpdateStatus', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    Active(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Active', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

}
