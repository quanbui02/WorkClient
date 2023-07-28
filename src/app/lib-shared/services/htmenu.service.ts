import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseService } from './base.service';
import { ResponseResult } from '../models/response-result';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HtMenuService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/HtMenu`);
    }
    getByIdPhanHe(idPhanHe: number, idCha: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/GetByIdPhanHe?idPhanHe=${idPhanHe}&idCha=${idCha}`;
        return this.defaultGet(url);
    }

    getDetailById(id: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/GetDetailById?id=${id}`;
        return this.defaultGet(url);
    }

    searchTree(phanHeId: number, trangThai: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/searchTree?phanHeId=${phanHeId}&trangThai=${trangThai}`;
        return this.defaultGet(url);
    }
    deleteCustom(id: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/deleteCustom/${id}`;

        return this._http.put<ResponseResult>(url, { id: id })
            .pipe(catchError((err: HttpErrorResponse) => this.handleError(err, this._injector)))
            .toPromise();
    }

    pinMenuItem(idMenu: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/PinMenuItem?menuId=${idMenu}`;
        return this._http
            .post<ResponseResult>(url, null)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    getsPinMenu(idPhanHe: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/GetsPinMenu?phanHeId=${idPhanHe}`;
        return this.defaultGet(url);
    }

    unPinMenuItem(idMenu: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/UnPinMenuItem?id=${idMenu}`;
        return this._http
            .post<ResponseResult>(url, null)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }
}

