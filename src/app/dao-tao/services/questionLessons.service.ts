import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class QuestionLessonsService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/QuestionLessons`);
  }
  Gets(key: string, idLesson: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false, isAcive?: boolean) {
    // let fDate;
    // let tDate;
    // if (fromDate) {
    //   fDate = fromDate.toISOString();
    // }
    // if (toDate) {
    //   tDate = toDate.toISOString();
    // }

    const queryString = `${this.serviceUri}?key=${key}&idLesson=${idLesson}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}&isActive=${isAcive}`;
    return this.defaultGet(queryString);
  }

  GetById(Id: number) {
    const queryString = `${this.serviceUri}/${Id}`;
    return this.defaultGet(queryString);
  }

  DeleteByQuestionLessionId(QuestionLessionId: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/DeleteByQuestionLessionId?QuestionLessionId=${QuestionLessionId}`, QuestionLessionId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  // BackToDelete(NewId: number) {
  //   return this._http
  //     .post<ResponseResult>(`${this.serviceUri}/BackToDelete?NewId=${NewId}`, NewId)
  //     .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  // }


  ChangeActive(QuestionLessionId: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeActive?QuestionLessionId=${QuestionLessionId}`, QuestionLessionId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }


  Save(item: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(this.serviceUri, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
}
