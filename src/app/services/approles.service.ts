import { Injectable, Injector } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Response } from '../shared/response';
import { environment } from '../../environments/environment';
import { BaseService } from '../lib-shared/services/base.service';
import { ResponseResult } from '../lib-shared/models/response-result';

@Injectable()
export class AppRolesService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.authorizationEndpoint}/AppRoles`);
    }

    search(term: string, isActive: number, offset: number, limit: number): Promise<ResponseResult> {
        return this._http.get<ResponseResult>(`${this.serviceUri}?term=${term}&isActive=${isActive}&offset=${offset}&limit=${limit}`).toPromise();
    }

    getUserRoles(userId: number): Promise<Response<any>> {
        return this._http.get<Response<any>>(`${this.serviceUri}/assigned/${userId}`).toPromise();
    }

    getUserRolesName(userId: string): Promise<Response<any>> {
        return this._http.get<Response<any>>(`${this.serviceUri}/assignedOnlyRole/${userId}`).toPromise();
    }

    assignUsersToRoles(userIds: number[], rolesIds: number[]): Promise<Response<any>> {
        return this._http.post<Response<any>>(`${this.serviceUri}/assigned`, { users: userIds, roles: rolesIds, fromDate: new Date(), toDate: new Date(2050, 12, 31) }).toPromise();
    }
}
