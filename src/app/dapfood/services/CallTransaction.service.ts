import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class CallTransactionService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/CallTransactions`);
    }

    Save(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri, item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

}
