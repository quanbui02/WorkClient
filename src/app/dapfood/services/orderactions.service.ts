import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';


@Injectable()
export class OrderActionsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/OrderActions`);
    }

    GetByIdOrder(id: number) {
        const queryString = `${this.serviceUri}/GetByIdOrder/${id}`;
        return this.defaultGet(queryString);
    }
}
