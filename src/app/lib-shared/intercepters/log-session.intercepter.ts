import {
    HttpInterceptor, HttpHeaderResponse, HttpUserEvent,
    HttpProgressEvent, HttpHandler, HttpSentEvent,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';

@Injectable()
export class LogSessionIntercepter implements HttpInterceptor {
    constructor(
        private _configurationService: ConfigurationService
    ) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent
        | HttpHeaderResponse | HttpProgressEvent
        | HttpResponse<any> | HttpUserEvent<any>> {
        const logSessionKey = sessionStorage.getItem(this._configurationService.logSessionKey);
        if (logSessionKey) {
            const authReq = req.clone({
                setHeaders: { 'log-session': logSessionKey }
            });
            return next.handle(authReq);
        }
        return next.handle(req);
    }
}
