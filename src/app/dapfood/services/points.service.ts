import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../../lib-shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable()
export class PointsService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Points`);
    }
    Gets(key: string, payment: number, dealType: number, userId: number, status: number, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate: string;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate: string;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}?key=${key}&payment=${payment}&dealType=${dealType}&userId=${userId}&status=${status}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetsCurrentUser(key: string, dealType: number, status: number, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate: string;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate: string;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}/GetsCurrentUser?key=${key}&dealType=${dealType}&status=${status}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    VerifyPaymentUrl(transaction_info: string, order_code: string, price: string, payment_id: string, payment_type: string, error_text: string, secure_code: string) {
        const queryString = `${this.serviceUri}/VerifyPaymentUrl?transaction_info=${transaction_info}&order_code=${order_code}&price=${price}&payment_id=${payment_id}&payment_type=${payment_type}&error_text=${error_text}&secure_code=${secure_code}`;
        return this.defaultGet(queryString);
    }

    Deposit(item: any) {
        const queryString = `${this.serviceUri}/Deposit`;
        return this.defaultPost(queryString, item);
    }
    Withdraw(item: any, code: string) {
        const queryString = `${this.serviceUri}/Withdraw?code=${code}`;
        return this.defaultPost(queryString, item);
    }
    CancelWithdraw(id: number) {
        const queryString = `${this.serviceUri}/CancelWithdraw/${id}`;
        return this.defaultPost(queryString, {});
    }
    CheckPayment(id: number) {
        const queryString = `${this.serviceUri}/CheckPayment/${id}`;
        return this.defaultPost(queryString, {});
    }
    Process(item: any) {
        const queryString = `${this.serviceUri}/Process`;
        return this.defaultPost(queryString, item);
    }

    ProcessKT(item: any) {
        const queryString = `${this.serviceUri}/ProcessKT`;
        return this.defaultPost(queryString, item);
    }

    ProcessAdmin(item: any) {
        const queryString = `${this.serviceUri}/ProcessAdmin`;
        return this.defaultPost(queryString, item);
    }

    ProcessFinish(item: any) {
        const queryString = `${this.serviceUri}/ProcessFinish`;
        return this.defaultPost(queryString, item);
    }
    GetWithdrawFee() {
        const queryString = `${this.serviceUri}/GetWithdrawFee`;
        return this.defaultGet(queryString);
    }

}

