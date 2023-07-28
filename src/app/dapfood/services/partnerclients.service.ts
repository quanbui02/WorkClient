import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';
import { OAuthService } from 'angular-oauth2-oidc';


@Injectable()
export class PartnerClientsService extends BaseService {
    constructor(http: HttpClient, injector: Injector, public _oauthService: OAuthService) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/PartnerClients`);
    }

    Gets(idClient: number) {
        const queryString = `${this.serviceUri}?idClient=${idClient}`;
        return this.defaultGet(queryString);
    }

    getToken() {
        const queryString = `${environment.apiDomain.authenticationEndpoint}/Users/getToken`;
        return this._http.get<string>(queryString).toPromise();
    }

    connectVs(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(`${this.serviceUri}/connectps`, item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }
    loginVs(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(`${this.serviceUri}/loginVs`, item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }
    registerVs(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(`${this.serviceUri}/registerps`, item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    getAccountInfo(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(`${this.serviceUri}/getAccountInfo`, item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

}

