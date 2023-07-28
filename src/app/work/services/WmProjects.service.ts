import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';

@Injectable()
export class WmProjectsService extends BaseService {
   constructor(http: HttpClient, injector: Injector) {
      super(http, injector, `${environment.apiDomain.dapWorkEndPoint}/WmProjects`);
   }
   Gets(key: string, hideChildren: boolean, isActived?: boolean, isDeleted?: boolean, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
      const queryString = `${this.serviceUri}?key=${key}&hideChildren=${hideChildren}&isActived=${isActived}&isDeleted=${isDeleted}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
      return this.defaultGet(queryString);
   }
   GetDetailSprints(key: string, idProject?: number, isActived?: boolean, isDeleted?: boolean, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
      const queryString = `${this.serviceUri}/GetDetailSprints?key=${key}&idProject=${idProject}&isActived=${isActived}&isDeleted=${isDeleted}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
      return this.defaultGet(queryString);
   }
   GetProjectDashboard(key: string, completed?: boolean, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
      const queryString = `${this.serviceUri}/GetProjectDashboard?key=${key}&completed=${completed}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
      return this.defaultGet(queryString);
   }

   ChangeActive(Id: number) {
      return this._http
         .post<ResponseResult>(`${this.serviceUri}/ChangeActive?id=${Id}`, Id)
         .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
   }
   Save(item: any): Promise<ResponseResult> {
      return this._http
         .post<ResponseResult>(this.serviceUri, item)
         .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
   }
   GetProjectsMenu(key: string) {
      const queryString = `${this.serviceUri}/GetProjectsMenu?key=${key}`;
      return this.defaultGet(queryString);
   }
   GetsGanttProjectSprint(id?: number) {
      const queryString = `${this.serviceUri}/GetsGanttProjectSprint?id=${id}`;
      return this.defaultGet(queryString);
   }
   GetDetail(id: any): Promise<ResponseResult> {
      const url = `${this.serviceUri}/GetDetail?id=${id}`;
      return this.defaultGet(url);
   }
}
