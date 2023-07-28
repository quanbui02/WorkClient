import {
    HttpInterceptor, HttpHeaders, HttpHeaderResponse, HttpUserEvent,
    HttpProgressEvent, HttpHandler, HttpSentEvent,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

export class TestNonAuthenIntercepter implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent
        | HttpHeaderResponse | HttpProgressEvent
        | HttpResponse<any> | HttpUserEvent<any>> {
        let url = '';
        if (req.url.indexOf('?') > -1) {
            url += '&testNonAuthen=true';
        } else {
            url += '?testNonAuthen=true';
        }

        const authReq = req.clone({
            url: url
        });
        return next.handle(authReq);
    }
}
