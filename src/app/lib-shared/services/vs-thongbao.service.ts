import { Injectable, Injector } from '@angular/core';
import { ModuleConfigService } from './module-config.service';
import { VsBaseService, ResponseResult } from './psbase.service';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { VsNotify, VsThongBao } from '../models/vsthongbao';


@Injectable()
export class VsThongBaoService extends VsBaseService<VsThongBao> {
    constructor(http: HttpClient, injector: Injector, config: ModuleConfigService) {
        super(http, 'config.getConfig().', injector);
    }
    sendNotify(myNotify: VsNotify): Promise<ResponseResult> {
        const url = `${environment.apiDomain.notificationEndpoint}/notifications`;
        return this.http
            .post<ResponseResult>(url, myNotify)
            .pipe(retry(3), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }
    guiThongBaoQuaEmail(thongbao: VsThongBao) {
        const url = `${this.svUrl}/GuiThongBaoQuaEmail`;
        return this.http
            .post<ResponseResult>(url, thongbao)
            .pipe(retry(3), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }
}
