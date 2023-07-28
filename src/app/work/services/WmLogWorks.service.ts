import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class WmLogWorksService extends BaseService {
   constructor(http: HttpClient, injector: Injector) {
      super(http, injector, `${environment.apiDomain.dapWorkEndPoint}/WmTaskLogs`);
   }
   Gets(idProject: number, idTask: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
      const queryString = `${this.serviceUri}?idProject=${idProject}&idTask=${idTask}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
      return this.defaultGet(queryString);
   }
   Save(item: any): Promise<ResponseResult> {
      return this._http
         .post<ResponseResult>(this.serviceUri, item)
         .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
   }
   GetDetail(Id: number) {
      const queryString = `${this.serviceUri}/GetDetail?id=${Id}`;
      return this.defaultGet(queryString);
   }

}
