import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class VnInvoiceService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapEInvoiceEndPoint}/VnInvoice`);
    }

    Gets(key: string, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField: string = '', isAsc: Number = 0) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}?key=${key}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    PrintUnOfficial(erpId: any) {
        const queryString = `${this.serviceUri}/PrintUnOfficial?erpId=${erpId}`;
        return this.defaultGet(queryString);
    }

}
