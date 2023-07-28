import {
    HttpInterceptor, HttpHeaderResponse, HttpUserEvent,
    HttpProgressEvent, HttpHandler, HttpSentEvent,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';

@Injectable()
export class AuthorizationIntercepter implements HttpInterceptor {
    constructor(
        private _authStorage: OAuthStorage
    ) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent
        | HttpHeaderResponse | HttpProgressEvent
        | HttpResponse<any> | HttpUserEvent<any>> {
        const token = localStorage.getItem('access_token');
        if (token) {
            // const permission = sessionStorage.getItem('permissions');
            // const b64 = btoa(permission);
            const header = 'Bearer ' + token;
            const headers = req.headers.set('Authorization', header); //.set('permissions', b64);
            req = req.clone({ headers });
        }
        return next.handle(req);
    }
}


