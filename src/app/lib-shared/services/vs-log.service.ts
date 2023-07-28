import { Injectable, Injector } from '@angular/core';
import { ModuleConfigService } from './module-config.service';
import { VsBaseService } from './psbase.service';

import { HttpClient } from '@angular/common/http';
import { VsLog } from '../models/vslog';
export interface ResponseResult {
    status: boolean;
    message: string;
    error: string;
    data: any;
    totalRecord: number;
    metadata: any;
}

export interface ResponseSingleResult {
    metadata: any;
    data: any;
}
@Injectable()
export class VsLogService extends VsBaseService<VsLog> {
    constructor(http: HttpClient, injector: Injector, config: ModuleConfigService) {
        super(http, 'https://dapfood.com:8080/log.api/api/Logs', injector);
    }
    getLogAction(): Promise<ResponseSingleResult> {
        const url = `${this.svUrl
            }/Action`;
        return this.http
            .get<ResponseResult>(url)
            .toPromise()
            ;
    }
}
