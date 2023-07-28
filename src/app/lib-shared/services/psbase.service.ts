import { Injector } from '@angular/core';

import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { VsBaseModel } from '../models/base.model';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { VsAuthenService } from '../auth/authen.service';

export interface IVsService<T extends VsBaseModel> {
    svUrl: string;
    get(): Promise<ResponseResult>;
    getDetail(id: number): Promise<ResponseResult>;
    save(item: T, IsUpdate: boolean): Promise<ResponseResult>;
    post(item: T): Promise<ResponseResult>;
    put(item: T): Promise<ResponseResult>;
    delete(id: number): Promise<ResponseResult>;
    handleError(error: any, injector: Injector): any;
    deleteMulti(ids: any): Promise<ResponseResult>;
}
export interface ResponseResult {
    status: boolean;
    success?: boolean;
    message: string;
    error: string;
    data: any;
    totalRecord: number;
    metadata: any;
}
export interface ResponseSingleResult {
    statusCode: string;
    success: boolean;
    message: string;
    messageCode: string;
    data: any;
}

export abstract class VsBaseService<T extends VsBaseModel>
    implements IVsService<T> {
    svUrl: string;
    injector: Injector;
    http: HttpClient;

    constructor(private _http: HttpClient, svUrl: string, _injector: Injector) {
        this.svUrl = svUrl;
        this.injector = _injector;
        this.http = _http;
    }
    get(): Promise<ResponseResult> {
        return this._http
            .get<ResponseResult>(this.svUrl)
            .toPromise()
            ;
    }
    getAll(): Promise<ResponseResult> {
        return this._http
            .get<ResponseResult>(this.svUrl + '?offset=0&limit=9999')
            .pipe(retry(3), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }
    getDetail(id: number): Promise<ResponseResult> {
        const url = `${this.svUrl}/${id}`;
        return this._http
            .get<ResponseResult>(url)
            .pipe(retry(3), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    save(item: T, IsUpdate: boolean): Promise<ResponseResult> {
        // if (IsUpdate) {
        //     return this.put(item);
        // }
        return this.post(item);
    }

    post(item: T): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.svUrl, item)
            .pipe(retry(3), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    put(item: T): Promise<ResponseResult> {
        const url = `${this.svUrl}`;

        return this._http
            .put<ResponseResult>(url, item)
            .toPromise()
            ;
    }

    delete(id: number): Promise<ResponseResult> {
        const url = `${this.svUrl}/${id}`;
        return this._http
            .delete<ResponseResult>(url)
            .toPromise()
            ;
    }

    deleteMulti(ids: any): Promise<ResponseResult> {
        if (typeof ids === 'object') { ids = ids.join(';'); }
        const url = `${this.svUrl}?ids=${ids}`;
        return this._http
            .delete<ResponseResult>(url)
            .toPromise()
            ;
    }

    handleError(error: any, injector: Injector) {
        // console.error('Có lỗi xảy ra', error);
        if (error.status === 401) {
            // let authenService = injector.get(VsAuthenService);
            // authenService.logout();
        } else {
            // console.log('Lỗi chung chung');
        }
        return Promise.reject(error);
    }

    addAuthorization(headers: Headers): Headers {
        // let authen: AuthenticationService = this.injector.get(
        //     AuthenticationService
        // );
        // let token = authen.getAuthorization();
        // headers.append('Content-Type', 'application/json');
        // if (token) headers.append('Authorization', token);
        return headers;
    }
}
