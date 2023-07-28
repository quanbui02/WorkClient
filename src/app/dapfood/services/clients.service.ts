import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ResponseResult } from '../../lib-shared/models/response-result';
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class ClientsService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Clients`);
    }

    Active(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/Active', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetByUserId(): Promise<ResponseResult> {
        const url = `${this.serviceUri}/GetByUserId`;
        return this.defaultGet(url);
    }

    Gets(key: string, isSendSms: boolean, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&isSendSms=${isSendSms}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetShort(key: string) {
        const queryString = `${this.serviceUri}/GetShort?key=${key}&isDC=-1&idDC=-1`;
        return this.defaultGet(queryString);
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

    UpdateDonViAddress(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/UpdateDonViAddress', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    GetLogistics() {
        const queryString = `${this.serviceUri}/GetLogistics`;
        return this.defaultGet(queryString);
    }

    UpdateDonViLogictics(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/UpdateDonViLogictics', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    ConnectDonViLogictics(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/ConnectDonViLogictics', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    ViettelPostGetAddress() {
        const queryString = `${this.serviceUri}/ViettelPostGetAddress`;
        return this.defaultGet(queryString);
    }

    GHN_GetDanhSachCH(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/GHN_GetDanhSachCH', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    SaveCODSupport(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/SaveCODSupport', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    DeleteCODSupport(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/DeleteCODSupport', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }
    // checkShowToken(): any {
    //     const queryString = `${this.serviceUri}/CheckShowToken`;
    //     return this._http
    //         .post<ResponseResult>(queryString, "CheckShowToken")
    //         .pipe(catchError(err => this.handleError(err, this._injector)))
    //         .toPromise();
    // }
}
