import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';


@Injectable()
export class ProvincesService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Provinces`);
    }

    GetShort() {
        const queryString = `${this.serviceUri}/GetShort`;
        return this.defaultGet(queryString);
    }

    GetShortProduct(idRegions: number, isSellApp: number) {
        const queryString = `${this.serviceUri}/GetShortProduct?idRegions=${idRegions}&isSellApp=${isSellApp}`;
        return this.defaultGet(queryString);
    }

    Autocomplete(key: string, idProvince: number, idDistrict: number, idWard: number, offset?: number, limit?: number) {
        const queryString = `${this.serviceUri}/Autocomplete?key=${key}&idProvince=${idProvince}&idDistrict=${idDistrict}&idWard=${idWard}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString);
    }

}

