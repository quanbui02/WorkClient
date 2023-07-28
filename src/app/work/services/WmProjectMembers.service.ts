import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';;


@Injectable()
export class WmProjectMembersService extends BaseService {

  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapWorkEndPoint}/WmProjectMembers`);
  }

  Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc = false) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
    return this.defaultGet(queryString);
  }

  GetsByIdProject(key: string, idProject: number, offset?: number, limit?: number, sortField?: string, isAsc = false) {
    const queryString = `${this.serviceUri}/GetsByIdProject?key=${key}&idProject=${idProject}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
    return this.defaultGet(queryString);
  }

  // DeleteMember(id: number): Promise<ResponseResult> {
  //   const url = `${this.serviceUri}/DeleteMember/${id}`;
  //   return this._http
  //     .delete<ResponseResult>(url)
  //     .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  // }

} 
