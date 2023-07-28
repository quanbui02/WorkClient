import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../../lib-shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable()
export class StatementsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Statements`);
    }

    Gets(key: string, dealType: number, userId: number, status: number, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate = undefined;
        if (fromDate)
            fDate = fromDate.toISOString();
        let tDate = undefined;
        if (toDate)
            tDate = toDate.toISOString();
        const queryString = `${this.serviceUri}?key=${key}&dealType=${dealType}&userId=${userId}&status=${status}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetsCurrentUser(key: string, dealType: number, status: number, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate = undefined;
        if (fromDate)
            fDate = fromDate.toISOString();
        let tDate = undefined;
        if (toDate)
            tDate = toDate.toISOString();
        const queryString = `${this.serviceUri}/GetsCurrentUser?key=${key}&dealType=${dealType}&status=${status}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetBalance() {
        const queryString = `${this.serviceUri}/GetBalance`;
        return this.defaultGet(queryString);
    }
    GetBalanceCSKH(fromDate: Date, toDate: Date, type: number) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/GetBalanceCSKH?fromDate=${fDate}&toDate=${tDate}&type=${type}`;
        return this.defaultGet(queryString);
    }

    GetBalanceDN(fromDate: Date, toDate: Date, type: number) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/GetBalanceDN?fromDate=${fDate}&toDate=${tDate}&type=${type}`;
        return this.defaultGet(queryString);
    }

    ThongKeDNTheoTrangThai(fromDate: Date, toDate: Date, type: number) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/ThongKeDNTheoTrangThai?fromDate=${fDate}&toDate=${tDate}&type=${type}`;
        return this.defaultGet(queryString);
    }

    Withdraw(deal: number) {
        const queryString = `${this.serviceUri}/Withdraw/${deal}`;
        return this.defaultPost(queryString, {});
    }
    CancelWithdraw(id: number) {
        const queryString = `${this.serviceUri}/CancelWithdraw/${id}`;
        return this.defaultPost(queryString, {});
    }
    Process(item: any) {
        const queryString = `${this.serviceUri}/Process`;
        return this.defaultPost(queryString, item);
    }
    Transfer(item: any, type: number) {
        const queryString = `${this.serviceUri}/Transfer?type=${type}`;
        return this.defaultPost(queryString, item);
    }
}

