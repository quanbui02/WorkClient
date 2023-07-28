import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class WmUsersService extends BaseService {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, `${environment.apiDomain.dapWorkEndPoint}/WmUsers`);
  }

  GetDetail(Id: number) {
    const queryString = `${this.serviceUri}/GetDetail?id=${Id}`;
    return this.defaultGet(queryString);
  }
}
