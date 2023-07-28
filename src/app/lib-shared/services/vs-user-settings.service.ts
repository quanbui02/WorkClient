import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VsUserSettingsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/tbl_DM_HeThong_Menu`);
    }

    getSettingByUrl(idPhanHe: number, url: string) {
        return this.defaultGet(`${this.serviceUri}/GetSettingByUrl?idPhanHe=${idPhanHe}&url=${url}`);
    }
}

