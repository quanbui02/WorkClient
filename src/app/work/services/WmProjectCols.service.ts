import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class WmProjectColsService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapWorkEndPoint}/WmProjectCols`);
  }
  Gets(key: string, idProject?: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
    const queryString = `${this.serviceUri}?key=${key}&idProject=${idProject}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
    return this.defaultGet(queryString);
  }

  GetByProjects(idProject?: number, idProjectCol?: number) {
    const queryString = `${this.serviceUri}/GetByProjects?idProject=${idProject}&idProjectCol=${idProjectCol}`;
    return this.defaultGet(queryString);
  }

  GetDetail(Id: number) {
    const queryString = `${this.serviceUri}/GetDetail?id=${Id}`;
    return this.defaultGet(queryString);
  }

  ChangeDelete(Id: number, idProjectColMove: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeDelete?id=${Id}&idProjectColMove=${idProjectColMove}`, Id)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  ChangeActive(Id: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeActive?id=${Id}`, Id)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  ChangeSort(Id: number, Sort: number): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeSort?id=${Id}&sort=${Sort}`, null)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }


  Save(item: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(this.serviceUri, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
} 
