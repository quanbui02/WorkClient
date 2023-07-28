import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class NewsService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/News`);
  }
  Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false, isAcive?: boolean, isDelete?: boolean) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}&isActive=${isAcive}&isDelete=${isDelete}`;
    return this.defaultGet(queryString);
  }

  GetByNewId(NewId: number) {
    const queryString = `${this.serviceUri}/GetByNewId?NewId=${NewId}`;
    return this.defaultGet(queryString);
  }

  DeleteByNewId(NewId: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/DeleteByNewId?NewId=${NewId}`, NewId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  BackToDelete(NewId: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/BackToDelete?NewId=${NewId}`, NewId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }


  ChangeActive(NewId: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeActive?NewId=${NewId}`, NewId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }


  Save(item: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(this.serviceUri, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
}
