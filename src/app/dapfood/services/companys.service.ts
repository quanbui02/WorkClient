import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class CompanysService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapEInvoiceEndPoint}/Companys`);
    }

    Gets() {
        const queryString = `${this.serviceUri}`;
        return this.defaultGet(queryString);
    }

    GetCompanys(key: string, offset?: number, limit?: number, sortField: string = '', isAsc: Number = 0) {
        const queryString = `${this.serviceUri}/GetCompanys?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
}
