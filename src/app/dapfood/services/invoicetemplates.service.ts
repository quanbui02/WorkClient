import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class InvoiceTemplatesService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapEInvoiceEndPoint}/InvoiceTemplates`);
    }

    Gets() {
        const queryString = `${this.serviceUri}`;
        return this.defaultGet(queryString);
    }
    GetByIdCompany(idCompany: number) {
        let queryString = `${this.serviceUri}/GetByIdCompany/${idCompany}`;
        return this.defaultGet(queryString);
    }
    SynInfoTemplate() {
        let queryString = `${this.serviceUri}/SynInfoTemplate`;
        return this.defaultGet(queryString);
    }
}
