
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';


@Injectable({
    providedIn: 'root'
})
export class SendAccessTokenInterceptor implements HttpInterceptor {

    constructor(public _oauthService: OAuthService) { }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this._oauthService.getAccessToken()}`
            }
        });
        return next.handle(request);
    }
}



