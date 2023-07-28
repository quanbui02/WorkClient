import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../../lib-shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class LogSmsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/LogSms`);
    }

    Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetOtp(type: number) {
        const queryString = `${this.serviceUri}/GetOtp?type=${type}`;
        return this.defaultGet(queryString);
    }

    SendSMS(topCtv: number, topOrder: number, idsProducts: string, idProduct: string, name: string) {
        const queryString = `${this.serviceUri}/SendSMS?topCtv=${topCtv}&topOrder=${topOrder}&idsProducts=${idsProducts}&idProduct=${idProduct}&name=${name}`;
        return this.defaultGet(queryString);
    }

}

