import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';


@Injectable()
export class AhamoveService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Ahamove`);
    }

    GetListServices(city: string) {
        const queryString = `${this.serviceUri}/GetListServices?city=${city}`;
        return this.defaultGet(queryString);
    }

    CancelShipOrder(codeShip: string, noteCancel: string) {
        const queryString = `${this.serviceUri}/CancelOrder?codeShip=${codeShip}&comment=${noteCancel}`;
        return this.defaultGet(queryString);
    }

}
