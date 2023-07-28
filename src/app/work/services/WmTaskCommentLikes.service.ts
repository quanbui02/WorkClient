import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class WmTaskCommentLikesService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapWorkEndPoint}/WmTaskCommentLikes`);
  }
  Like(taskCommentId: number, taskId: number): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/Like?taskCommentId=${taskCommentId}&taskId=${taskId}`, null)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

}
