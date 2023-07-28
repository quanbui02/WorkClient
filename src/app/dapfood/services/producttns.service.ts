import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class ProductTnService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/ProductTns`);
    }
    getDetail(id: any): Promise<ResponseResult> {
        const url = `${this.serviceUri}/getDetail?id=${id}`;
        return this.defaultGet(url);
    }
    Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    GetsByAdmin(key: string, userId: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetsByAdmin?key=${key}&userId=${userId}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    deleteAll(id: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/deleteAll/${id}`;
        return this.defaultDelete(url);
    }
    Approved(id: number, approve: boolean) {
        const queryString = `${this.serviceUri}/Approved?id=${id}&approve=${approve}`;
        return this.defaultGet(queryString);
    }
}
