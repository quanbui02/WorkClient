import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../../lib-shared/services/base.service';
import { ResponseResult } from '../../../lib-shared/models/response-result';

@Injectable()
export class DeliveryCategoriesService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/DeliveryCategories`);
  }
  Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
    const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
    return this.defaultGet(queryString);
  }

  GetById(Id: number) {
    const queryString = `${this.serviceUri}/GetById?Id=${Id}`;
    return this.defaultGet(queryString);
  }

  ChangeActive(Id: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/ChangeActive?Id=${Id}`, Id)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  Delete(Id: number) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/Delete?Id=${Id}`, Id)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  Save(item: any) {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}`, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

}

