import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class TopicUsersService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/TopicUsers`);
    }
    GetByUserId() {
        const queryString = `${this.serviceUri}/GetByUserId`;
        return this.defaultGet(queryString);
    }
}
