import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';


@Injectable()
export class OrderStatusService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/OrderStatus`);
    }

    GetByIdOrder(id: number) {
        const queryString = `${this.serviceUri}/GetByIdOrder/${id}`;
        return this.defaultGet(queryString);
    }
}
