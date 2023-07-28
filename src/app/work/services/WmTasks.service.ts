import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class WmTasksService extends BaseService {
   constructor(http: HttpClient, injector: Injector) {
      super(http, injector, `${environment.apiDomain.dapWorkEndPoint}/WmTasks`);
   }
   Gets(key: string, memberProject: string, userId?: number, id?: number, completed?: boolean, idProject?: number, star?: boolean, type?: number, priority?: number, idProjectCol?: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
      const queryString = `${this.serviceUri}?key=${key}&userId=${userId}&id=${id}&completed=${completed}&idProject=${idProject}&star=${star}&type=${type}&priority=${priority}&idProjectCol=${idProjectCol}&memberProject=${memberProject}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
      return this.defaultGet(queryString);
   }

   // GetMyTasks(key: string, UserId?: number, id?: number, completed?: boolean, idProject?: number, star?: boolean, type?: number, priority?: number, idProjectCol?: number, idSprint?: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
   //   const queryString = `${this.serviceUri}/GetMyTasks?key=${key}&UserId=${UserId}&id=${id}&completed=${completed}&idProject=${idProject}&star=${star}&type=${type}&priority=${priority}&idProjectCol=${idProjectCol}&idSprint=${idSprint}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
   //   return this.defaultGet(queryString);
   // }
   GetsGantts(idProject?: number, idSprint?: number) {
      const queryString = `${this.serviceUri}/GetsGantts?idProject=${idProject}&idSprint=${idSprint}`;
      return this.defaultGet(queryString);
   }
   // GetsBoard(key: string, idProject?: number, star?: boolean, type?: number, priority?: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
   //    const queryString = `${this.serviceUri}/GetsBoard?key=${key}&idProject=${idProject}&star=${star}&type=${type}&priority=${priority}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
   //    return this.defaultGet(queryString);
   // }

   GetDetail(Id: number) {
      const queryString = `${this.serviceUri}/GetDetail?id=${Id}`;
      return this.defaultGet(queryString);
   }

   ChangeActive(Id: number) {
      return this._http
         .post<ResponseResult>(`${this.serviceUri}/ChangeActive?id=${Id}`, Id)
         .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
   }

   ChangeComplete(Id: number) {
      return this._http
         .post<ResponseResult>(`${this.serviceUri}/ChangeComplete?id=${Id}`, Id)
         .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
   }

   ChangeStar(Id: number) {
      return this._http
         .post<ResponseResult>(`${this.serviceUri}/ChangeStar?id=${Id}`, Id)
         .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
   }

   ChangeSortRow(Id: number, Sort: number, idSort: number, type: number, idProject?: number, idProjectCol?: number): Promise<ResponseResult> {
      return this._http
         .post<ResponseResult>(`${this.serviceUri}/ChangeSortRow?id=${Id}&sort=${Sort}&idSort=${idSort}&idProject=${idProject}&idProjectCol=${idProjectCol}&type=${type}`, null)
         .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
   }

   ChangeSortColumn(Id: number, Sort: number, idSort: number, idProjectCol: number, type: number) {
      return this._http
         .post<ResponseResult>(`${this.serviceUri}/ChangeSortColumn?id=${Id}&sort=${Sort}&idSort=${idSort}&idProjectCol=${idProjectCol}&type=${type}`, null)
         .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
   }

   Save(item: any): Promise<ResponseResult> {
      return this._http
         .post<ResponseResult>(this.serviceUri, item)
         .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
   }
}
