import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../../lib-shared/services/base.service';
import { ResponseResult } from '../../lib-shared/models/response-result';
import { off } from 'process';

@Injectable()
export class ChatsService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Chats`);
  }
  GetByChatTopicId(ChatTopicId: number) {
    const queryString = `${this.serviceUri}/GetByChatTopicId?ChatTopicId=${ChatTopicId}`;
    return this.defaultGet(queryString);
  }

  GetByOrderId(OrderId: number) {
    const queryString = `${this.serviceUri}/GetByOrderId?OrderId=${OrderId}`;
    return this.defaultGet(queryString);
  }

  GetByChatId(IdChat: number) {
    const queryString = `${this.serviceUri}/GetByChatId?IdChat=${IdChat}`;
    return this.defaultGet(queryString);
  }

  Save(item: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(this.serviceUri, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  SaveByCSKH(item: any): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/SaveByCSKH`, item)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }

  GetByCustomerIdByAdmin(customerId: number, offset?: number, limit?: number, isAsc: boolean = false) {
    const queryString = `${this.serviceUri}/GetByCustomerIdByAdmin?customerId=${customerId}&offset=${offset}&limit=${limit}&isAsc=${isAsc}`;
    return this.defaultGet(queryString);
  }

  GetTopic(key: string, offset?: number, limit?: number) {
    const queryString = `${this.serviceUri}/GetTopic?key=${key}&offset=${offset}&limit=${limit}`;
    return this.defaultGet(queryString);
  }

  UpdateReaded(CustomerId: number): Promise<ResponseResult> {
    return this._http
      .post<ResponseResult>(`${this.serviceUri}/UpdateReaded?customerId=${CustomerId}`, CustomerId)
      .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
  }
}
