import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class EInvoicesService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/EInvoices`);
    }

    CreateInvoice(typeInvoice: number, taxCode: string, templateNo: number, serialNo: string, ids: string) {
        const queryString = `${this.serviceUri}/CreateInvoice?typeInvoice=${typeInvoice}&taxCode=${taxCode}&templateNo=${templateNo}&serialNo=${serialNo}&ids=${ids}`;
        console.log("endpoint: " + queryString);
        return this.defaultGet(queryString);
    }

}
