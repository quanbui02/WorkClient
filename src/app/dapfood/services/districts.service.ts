import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';


@Injectable()
export class DistrictsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Districts`);
    }

    GetShort(idProvince: number) {
        const queryString = `${this.serviceUri}/GetShort?idProvince=${idProvince}`;
        return this.defaultGet(queryString);
    }
}

