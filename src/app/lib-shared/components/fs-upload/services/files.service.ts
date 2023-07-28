import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../services/base.service';
import { environment } from '../../../../../environments/environment';


@Injectable()
export class FilesService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.fileEndpoint}/Files`);
    }

    Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetByFolderId(folderId: number) {
        const queryString = `${this.serviceUri}/GetByFolderId/${folderId}`;
        return this.defaultGet(queryString);
    }

}

