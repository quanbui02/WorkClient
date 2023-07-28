import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../../lib-shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable()
export class GroupRegsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/GroupRegs`);
    }

    Gets(key: string, status: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&offset=${offset}&status=${status}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    Approve(id: number, status: number) {
        const queryString = `${this.serviceUri}/Approve/${id}/${status}`;
        return this.defaultPost(queryString, {});
    }

    Cancel(idGroup: number) {
        const queryString = `${this.serviceUri}/Cancel/${idGroup}`;
        return this.defaultPost(queryString, {});
    }
    CancelInvitation(id: number) {
        const queryString = `${this.serviceUri}/CancelInvitation/${id}`;
        return this.defaultPost(queryString, {});
    }
    Register(idGroup: number) {
        const queryString = `${this.serviceUri}/Register/${idGroup}`;
        return this.defaultPost(queryString, {});
    }
    InviteMember(userId: number) {
        const queryString = `${this.serviceUri}/InviteMember/${userId}`;
        return this.defaultPost(queryString, {});
    }
    AcceptInvitation(idGroup: number) {
        const queryString = `${this.serviceUri}/AcceptInvitation/${idGroup}`;
        return this.defaultPost(queryString, {});
    }
    DeclineInvitation(idGroup: number) {
        const queryString = `${this.serviceUri}/DeclineInvitation/${idGroup}`;
        return this.defaultPost(queryString, {});
    }
}

