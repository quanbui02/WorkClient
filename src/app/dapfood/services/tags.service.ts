import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class TagsService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Tags`);
  }
  Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
    return this.defaultGet(queryString);
  }

  GetByTagId(NewId: number) {
    const queryString = `${this.serviceUri}/GetByTagId?TagId=${NewId}`;
    return this.defaultGet(queryString);
  }

  ChangeActive(NewId: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeActive?TagId=${NewId}`, NewId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }


  Save(item: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(this.serviceUri, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
}

