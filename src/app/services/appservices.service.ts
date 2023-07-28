import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '../shared/response';
import { environment } from '../../environments/environment';
import { BaseService } from '../lib-shared/services/base.service';
import { ResponseResult } from '../lib-shared/models/response-result';

@Injectable()
export class AppServicesService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.authorizationEndpoint}/Appservices`);
    }

    search(term: string, isActive: number, pageIndex: number, pageSize: number): Promise<ResponseResult> {
        return this._http.get<ResponseResult>(`${this.serviceUri}?pageIndex=${pageIndex}&pageSize=${pageSize}&term=${term}&isActive=${isActive}`).toPromise();
    }

    syncPermisisons(id: number): Promise<Response<any>> {
        return this._http.get<Response<any[]>>(`${this.serviceUri}/syncpermissions/${id}`).toPromise();
    }

    getGroups(id: number): Promise<Response<any>> {
        return this._http.get<Response<any[]>>(`${this.serviceUri}/getctlgroups?id=${id}`).toPromise();
    }
}
