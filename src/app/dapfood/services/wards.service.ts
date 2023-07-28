import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';


@Injectable()
export class WardsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Wards`);
    }

    GetShort(idDistrict: number) {
        const queryString = `${this.serviceUri}/GetShort?idDistrict=${idDistrict}`;
        return this.defaultGet(queryString);
    }

    GetShortByListId(lstId: string) {
        const queryString = `${this.serviceUri}/GetShortByListId?listId=${lstId}`;
        return this.defaultGet(queryString);
    }
}

