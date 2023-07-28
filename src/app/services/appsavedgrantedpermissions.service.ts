import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseResult } from '../lib-shared/services/psbase.service';
import { environment } from '../../environments/environment';
import { BaseService } from '../lib-shared/services/base.service';

@Injectable()
export class AppSavedGrantedPermissions extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.authorizationEndpoint}/AppSavedGrantedPermissions`);
    }

    createTemplate(templateName: string): Promise<ResponseResult> {
        const data = { templateName: templateName };
        return this._http.post<ResponseResult>(`${this.serviceUri}`, data).toPromise();
    }

    updateTemplate(id: number, templateName: string): Promise<ResponseResult> {
        const data = { templateName: templateName };
        return this._http.put<ResponseResult>(`${this.serviceUri}/${id}`, data).toPromise();
    }

    getListTemplate(): Promise<ResponseResult> {
        return this._http.get<ResponseResult>(`${this.serviceUri}`).toPromise();
    }
}
