import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class WmNoteService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapWorkEndPoint}/WmNotes`);
  }
  Gets(key: string, idProject?: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
    const queryString = `${this.serviceUri}?key=${key}&idProject=${idProject}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
    return this.defaultGet(queryString);
  }

  Delete(Id: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/Delete?id=${Id}`, Id)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
  changeStar(Id: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/changeStar?id=${Id}`, Id)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
  //  ChangeActive(Id: number) {
  //     return this._http
  //        .post<ResponseResult>(`${this.serviceUri}/ChangeActive?id=${Id}`, Id)
  //        .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  //  }
  Save(item: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(this.serviceUri, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
  GetDetail(Id: number) {
    const queryString = `${this.serviceUri}/GetDetail?id=${Id}`;
    return this.defaultGet(queryString);
  }
  ChangeSort(Id: number, Position: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeSort?id=${Id}&position=${Position}`, null)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  ChangeBgColor(Id: number, BgColor: string) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeBgColor?id=${Id}&bgColor=${encodeURIComponent(BgColor)}`, null)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
}
