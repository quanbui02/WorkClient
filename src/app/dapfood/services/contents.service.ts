import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';


@Injectable()
export class ContentService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Contents`);
    }

    Gets(idProduct: number, status: number, type: number) {
        const queryString = `${this.serviceUri}?idProduct=${idProduct}&status=${status}&type=${type}`;
        return this.defaultGet(queryString);
    }
    GetByIdProduct(idProduct: number) {
        const queryString = `${this.serviceUri}/GetByIdProduct/${idProduct}`;
        return this.defaultGet(queryString);
    }

}

