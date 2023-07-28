import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class LessonRatesService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/LessionRates`);
  }
  Gets(key: string, rating: number, idLesson: number, fromDate?: Date, toDate?: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false, isAcive?: boolean) {
    let fDate;
    let tDate;
    if (fromDate) {
      fDate = fromDate.toISOString();
    }
    if (toDate) {
      tDate = toDate.toISOString();
    }

    const queryString = `${this.serviceUri}?key=${key}&rating=${rating}&idLesson=${idLesson}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}&isActive=${isAcive}`;
    return this.defaultGet(queryString);
  }

  GetById(Id: number) {
    const queryString = `${this.serviceUri}/${Id}`;
    return this.defaultGet(queryString);
  }

  DeleteByLessionRateId(LessionRateId: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/DeleteByLessionRateId?LessionRateId=${LessionRateId}`, LessionRateId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  UpdateRatingById(id: number, rating: number, comment: string): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/UpdateRatingById?id=${id}&rating=${rating}&comment=${comment}`, null)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  // BackToDelete(NewId: number) {
  //   return this._http
  //     .post<ResponseResult>(`${this.serviceUri}/BackToDelete?NewId=${NewId}`, NewId)
  //     .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  // }


  ChangeActive(PathologyId: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeActive?LessionRateId=${PathologyId}`, PathologyId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }


  Save(item: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(this.serviceUri, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
}
