import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';


@Injectable()
export class UserAddressUserService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/UserAddress`);
    }

    Gets(key) {
        const queryString = `${this.serviceUri}?key=${key}&offset=0&limit=20&sortField=&isAsc=`;
        return this.defaultGet(queryString);
    }

    GetShort(key) {
        const queryString = `${this.serviceUri}/GetShort?key=${key}`;
        return this.defaultGet(queryString);
    }

    UpdateDefault(id: number) {
        const queryString = `${this.serviceUri}/UpdateDefault?id=${id}`;
        return this.defaultPost(queryString, {});
    }
}

