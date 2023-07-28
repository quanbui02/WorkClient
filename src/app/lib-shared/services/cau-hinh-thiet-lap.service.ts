import { Injectable, Injector } from '@angular/core';

import { VsBaseService, ResponseResult } from './psbase.service';
import { VsCauHinhThietLap } from '../models/vsCauHinhThietLap';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class TNThietLapCauHinhService extends VsBaseService<VsCauHinhThietLap<any>> {
    constructor(http: HttpClient, injector: Injector, private httpModule: HttpClient) {
        super(http, `${environment.apiDomain.dapFoodEndPoint}/ThietLapCauHinh`, injector);
    }

    getCauHinh(ma: string): Promise<ResponseResult> {
        const url = `${this.svUrl}/getCauHinh/${ma}`;
        return this.http
            .get<ResponseResult>(url)
            .pipe(retry(3), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }
    setCauHinh(cauhinh: any): Promise<ResponseResult> {
        const url = `${this.svUrl}/setCauHinh`;
        return this.http
            .post<ResponseResult>(url, cauhinh)
            .pipe(retry(3), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

}
