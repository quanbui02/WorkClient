import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../services/base.service';
import { environment } from '../../../../../environments/environment';


@Injectable()
export class FoldersService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.fileEndpoint}/Folders`);
    }

    GetRootFolder() {
        const queryString = `${this.serviceUri}/GetRootFolder`;
        return this.defaultGet(queryString);
    }

    GetByParentId(parentId: number) {
        const queryString = `${this.serviceUri}/GetByParentId/${parentId}`;
        return this.defaultGet(queryString);
    }

    Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

}

