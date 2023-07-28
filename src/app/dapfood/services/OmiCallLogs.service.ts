import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class OmiCallLogsService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/OmiCallLogs`);
    }

    Save(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri, item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    Gets(key: string, direction: string, endCause: string, sipUser: number, fromDate: number, toDate: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&direction=${direction}&endCause=${endCause}&sipUser=${sipUser}&fromDate=${fromDate}&toDate=${toDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    UpdateActionLog(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(`${this.serviceUri}/UpdateActionLog`, item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    UpdateOmicallLog(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(`${this.serviceUri}/UpdateOmicallLog`, item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetLogByOrderAction(actionId: number) {
        const queryString = `${this.serviceUri}/GetLogByOrderAction?actionId=${actionId}`;
        return this.defaultGet(queryString);
    }

    GetLogByOrderId(orderId: any) {
        const queryString = `${this.serviceUri}/GetLogByOrderId/${orderId}`;
        return this.defaultGet(queryString);
    }

    GetLogOmicallById(Id: number) {
        const queryString = `${this.serviceUri}/GetLogOmicallById?Id=${Id}`;
        return this.defaultGet(queryString);
    }
    GetLogByUserId(userId: any, offset: number = 0, limit: number = 20) {
        //console.log("id nguoi dung: " + userId);
        const queryString = `${this.serviceUri}/GetLogByUserId?userId=${userId}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString);
    }

    // UpdateUserIdOmicallLog(Id: number, UserId: number) {
    //     const queryString = `${this.serviceUri}/UpdateUserIdOmicallLog/${Id}/${UserId}`;
    //     return this.defaultGet(queryString);
    // }

    // UpdateOderIdOmicallLog(Id: any, OderId: any) {
    //     const queryString = `${this.serviceUri}/UpdateOderIdOmicallLog/${Id}/${OderId}`;
    //     return this.defaultGet(queryString);
    // }

    UpdateNoteOmicallLog(Uuid: any, Note: any) {
        const queryString = `${this.serviceUri}/UpdateNoteOmicallLog/${Uuid}/${Note}`;
        return this.defaultGet(queryString);
    }

}
