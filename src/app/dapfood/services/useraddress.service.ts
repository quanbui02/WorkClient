import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';


@Injectable()
export class UserAddressService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/UserAddress`);
    }

    GetsByUserId(UserId: number) {
        const queryString = `${this.serviceUri}?UserId=${UserId}`;
        return this.defaultGet(queryString);
    }

    GetIsSyn() {
        const queryString = `${this.serviceUri}/GetIsSyn?limit=10`;
        return this.defaultGet(queryString);
    }
}

