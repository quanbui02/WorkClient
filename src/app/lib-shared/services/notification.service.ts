import { Injectable, Injector } from '@angular/core';

import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { ResponseResult } from '../models/response-result';
@Injectable()
export class NotificationService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.notificationEndpoint}/Notifications`);
    }
    search(type: number, time: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/${type}/${time}`;
        return this.defaultGet(url);
    }
    getFavourite(id: number, type: number, time: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/Favourite/${type}/${time}/${id}`;
        return this.defaultGet(url);
    }
    unRead(type: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/UnRead/${type}`;
        return this.defaultGet(url);
    }
    getById(id: string): Promise<ResponseResult> {
        const url = `${this.serviceUri}/Read/${id}`;
        return this.defaultGet(url);
    }
    readAll(): Promise<ResponseResult> {
        const url = `${this.serviceUri}/ReadAll`;
        return this.defaultGet(url);
    }

    viewAll(): Promise<ResponseResult> {
        const url = `${this.serviceUri}/viewAll`;
        return this.defaultGet(url);
    }

    getsByUserId(offset: number = 0, limit: number = 10, type: number = 1, fromDate: string = '', toDate: string = ''): Promise<ResponseResult> {
        const apiUrl = `${this.serviceUri}/GetsByUserId?type=${type}&fromDate=${fromDate}&toDate=${toDate}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(apiUrl);
    }

    read(id: string): Promise<ResponseResult> {
        const apiUrl = `${this.serviceUri}/Read/${id}`;
        return this.defaultPost(apiUrl, {});
    }

}

