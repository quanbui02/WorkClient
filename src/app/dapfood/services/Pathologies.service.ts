import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class PathologiesService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Pathologies`);
  }
  Gets(key: string, pathologyCategoryId: number, fromDate?: Date, toDate?: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false, isAcive?: boolean) {
    let fDate;
    let tDate;
    if (fromDate) {
      fDate = fromDate.toISOString();
    }
    if (toDate) {
      tDate = toDate.toISOString();
    }

    const queryString = `${this.serviceUri}?key=${key}&pathologyCategoryId=${pathologyCategoryId}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}&isActive=${isAcive}`;
    return this.defaultGet(queryString);
  }

  GetByPathologyId(PathologyId: number) {
    const queryString = `${this.serviceUri}/GetDetailById/${PathologyId}`;
    return this.defaultGet(queryString);
  }

  DeleteByPathologyId(PathologyId: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/DeleteByPathologyId?PathologyId=${PathologyId}`, PathologyId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  // BackToDelete(NewId: number) {
  //   return this._http
  //     .post<ResponseResult>(`${this.serviceUri}/BackToDelete?NewId=${NewId}`, NewId)
  //     .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  // }


  ChangeActive(PathologyId: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeActive?PathologyId=${PathologyId}`, PathologyId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }


  Save(item: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(this.serviceUri, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
}
