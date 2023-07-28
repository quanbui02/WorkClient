import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class OmiCallsService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/OmiCalls`);
    }

    OmicallAgentDelete(identify_info: string) {
        const queryString = `${this.serviceUri}/AgentDelete/${identify_info}`;
        return this.defaultGet(queryString);
    }

    OmicallAgentInvite(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/AgentInvite', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    SaveOmiCallLogs(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/SaveOmiCallLogs', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    ContactsAdd(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/ContactsAdd', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    ContactsPhone(phone: string) {
        const queryString = `${this.serviceUri}/ContactsPhone/${phone}`;
        return this.defaultGet(queryString);
    }

    ContactsDelete(contactid: string) {
        const queryString = `${this.serviceUri}/ContactsDelete/${contactid}`;
        return this.defaultGet(queryString);
    }

    UpdateCallTransactionsById(Uuid: any) {
        const queryString = `${this.serviceUri}/UpdateCallTransactionsById/${Uuid}`;
        return this.defaultGet(queryString);
    }
    UpdateNoteOmicallLog(Uuid: any, Note: any) {
        const queryString = `${this.serviceUri}/UpdateNoteOmicallLog/${Uuid}/${Note}`;
        return this.defaultGet(queryString);
    }

    MultiUpdateCallTransactions(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri + '/MultiUpdateCallTransactions', item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }
}
