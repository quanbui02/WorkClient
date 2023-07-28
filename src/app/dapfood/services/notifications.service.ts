import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../../lib-shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { ResponseResult } from '../../lib-shared/models/response-result';


@Injectable()
export class NotificationsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Notifications`);
    }

    Gets(key: string, type: number, isSent: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&type=${type}&isSent=${isSent}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    SendNotification(id: number) {
        const queryString = `${this.serviceUri}/SendNotification/${id}`;
        return this.defaultPost(queryString, {});
    }
}

