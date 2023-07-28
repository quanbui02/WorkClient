import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseResult } from '../lib-shared/services/vs-log.service';
import { environment } from '../../environments/environment';
@Injectable()
export class UserRoleService {
    private _endpointUri: string;

    constructor(private http: HttpClient) {
        this._endpointUri = `${environment.apiDomain.authorizationEndpoint}/azUserRoles`;
    }

    getRolesByUsers(ids: any): Promise<ResponseResult> {
        return this.http.post<ResponseResult>(`${this._endpointUri}/GetRolesByUserIds`, { items: ids })
            .toPromise();
    }
}
