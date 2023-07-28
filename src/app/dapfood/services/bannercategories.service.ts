import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class BannercategoriesService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(
            http,
            injector,
            `${environment.apiDomain.dapFoodEndPoint}/bannercategories`
        );
    }
    Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetShort() {
        const queryString = `${this.serviceUri}/GetShort`;
        return this.defaultGet(queryString);
    }
}
