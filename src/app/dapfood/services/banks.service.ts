import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class BanksService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(
            http,
            injector,
            `${environment.apiDomain.dapFoodEndPoint}/Banks`
        );
    }
    Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetShort(key: string) {
        const queryString = `${this.serviceUri}/GetShort?key=${key}`;
        return this.defaultGet(queryString);
    }
}
