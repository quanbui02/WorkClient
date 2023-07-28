import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';
import { fdatasync } from 'fs';

@Injectable()
export class OrdersService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(
            http,
            injector,
            `${environment.apiDomain.dapFoodEndPoint}/Orders`
        );
    }

    FindCustommerByPhone(key: string = '', offset: number = 0, limit: number = 10000) {
        const queryString = `${this.serviceUri}/FindCustommerByPhone?key=${key}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString);
    }

    FindOrderByUser(UserId: number = 0, lstStatus: string, fromDate: Date, toDate: Date, offset: number = 0, limit: number) {
        let fDate;
        let tDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        if (toDate) {
            tDate = toDate.toISOString();
        }

        const queryString = `${this.serviceUri}/FindOrderByUser?UserId=${UserId}&status=${lstStatus}&toDate=${tDate}&fromDate=${fDate}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString);
    }

    Get(id: number) {
        let queryString = `${this.serviceUri}/GetDetail/${id}`;
        return this.defaultGet(queryString);
    }

    GetByIdRef(id: number) {
        const queryString = `${this.serviceUri}/GetByIdRef/${id}`;
        return this.defaultGet(queryString);
    }

    GetDetailPrint(ids: string) {
        const queryString = `${this.serviceUri}/GetDetailPrint?ids=${ids}`;
        return this.defaultGet(queryString);
    }

    GetForOrder(key: string = '', offset: number = 0, limit: number = 10000) {
        const queryString = `${this.serviceUri}/GetForOrder?key=${key}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString);
    }

    Gets(key: string, idProduct: number, status: number, fromDate: Date, toDate: Date, orderType: number, offset?: number, limit?: number, sortField: string = '', isAsc: Number = 0) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        const queryString = `${this.serviceUri}?key=${key}&idProduct=${idProduct}&status=${status}&fromDate=${fDate}&toDate=${tDate}&orderType=${orderType}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetForClient(key: string, idShop: number, idProvince: number, idDistrict: number, dateType: number, ctv: string, idProduct: number, shipStatus: any, isShip: number, status: any, actions: any, fromDate: any, toDate: any, dayNumber: number, paymentChannel: number, idUserKol: number, orderType: number, isPreOrder: number, offset?: number, limit?: number, sortField: string = '', isAsc: Number = 0) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        // tslint:disable-next-line: max-line-length
        const queryString = `${this.serviceUri}/GetForClient?key=${key}&idShop=${idShop}&idProvince=${idProvince}&idDistrict=${idDistrict}&dateType=${dateType}&ctv=${ctv}&idProduct=${idProduct}&shipStatus=${shipStatus}&isShip=${isShip}&status=${status}&actions=${actions}&fromDate=${fDate}&toDate=${tDate}&dayNumber=${dayNumber}&paymentChannel=${paymentChannel}&idUserKol=${idUserKol}&orderType=${orderType}&isPreOrder=${isPreOrder}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${(isAsc == 1 ? true : false)}`;
        return this.defaultGet(queryString);
    }

    GetForInvoice(key: string, idShop: number, idProvince: number, idDistrict: number, dateType: number, invoiceType: number, ctv: string, idProduct: number, shipStatus: any, isShip: number, status: any, actions: any, fromDate: any, toDate: any, dayNumber: number, paymentChannel: number, idUserKol: number, orderType: number, isInvoiced: number, offset?: number, limit?: number, sortField: string = '', isAsc: Number = 0) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        // tslint:disable-next-line: max-line-length
        const queryString = `${this.serviceUri}/GetForInvoice?key=${key}&idShop=${idShop}&idProvince=${idProvince}&idDistrict=${idDistrict}&dateType=${dateType}&invoiceType=${invoiceType}&ctv=${ctv}&idProduct=${idProduct}&shipStatus=${shipStatus}&isShip=${isShip}&status=${status}&actions=${actions}&fromDate=${fDate}&toDate=${tDate}&dayNumber=${dayNumber}&paymentChannel=${paymentChannel}&idUserKol=${idUserKol}&orderType=${orderType}&isInvoiced=${isInvoiced}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${(isAsc == 1 ? true : false)}`;
        return this.defaultGet(queryString);
    }

    GetsKOLIdsStatus(userId: number, key: string, idProduct: number, status: string, idOrder: number, fromDate: any, toDate: any, orderType: number, offset?: number, limit?: number, sortField: string = '', isAsc: boolean = false) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        // tslint:disable-next-line: max-line-length
        const queryString = `${this.serviceUri}/GetsKOLIdsStatus?userId=${userId}&key=${key}&idProduct=${idProduct}&status=${status}&idOrder=${idOrder}&fromDate=${fDate}&toDate=${tDate}&orderType=${orderType}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetForShop(key: string, ctv: string, idProduct: number, shipStatus: any, isShip: number, status: any, actions: any, fromDate: Date, toDate: Date, dayNumber: number, orderType: number, offset?: number, limit?: number, sortField: string = '', isAsc: Number = 0) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        // tslint:disable-next-line: max-line-length
        const queryString = `${this.serviceUri}/GetForShop?key=${key}&ctv=${ctv}&idProduct=${idProduct}&shipStatus=${shipStatus}&isShip=${isShip}&status=${status}&actions=${actions}&fromDate=${fDate}&toDate=${tDate}&dayNumber=${dayNumber}&orderType=${orderType}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${(isAsc == 1 ? true : false)}`;
        return this.defaultGet(queryString);
    }

    GetOrderByShipCode(shipCode: string) {
        const queryString = `${this.serviceUri}/GetOrderByShipCode?shipCode=${shipCode}`;
        return this.defaultGet(queryString);
    }

    GetListOrdersWattingShip() {
        const queryString = `${this.serviceUri}/GetListOrdersWattingShip`;
        return this.defaultPost(queryString, null);
    }

    GetListOrdersNeedShip() {
        const queryString = `${this.serviceUri}/GetListOrdersNeedShip`;
        return this.defaultPost(queryString, null);
    }

    GetDetailOrderAhamove(shipCode: string) {
        const queryString = `${this.serviceUri}/GetDetailOrderAhamove?shipCode=${shipCode}`;
        return this.defaultGet(queryString);
    }

    GetForLeader(key: string, ctv: string, idProduct: number, status: any, fromDate: Date, toDate: Date, dayNumber: number, orderType: number, offset?: number, limit?: number, sortField: string = '', isAsc: Number = 0) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        // tslint:disable-next-line: max-line-length
        const queryString = `${this.serviceUri}/GetForLeader?key=${key}&ctv=${ctv}&idProduct=${idProduct}&status=${status}&fromDate=${fDate}&toDate=${tDate}&dayNumber=${dayNumber}&orderType=${orderType}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetForAdmin(key: string, idClient: number, ctv: string, idProduct: number, status: any, fromDate: Date, toDate: Date, fromUpdate: Date, toUpdate: Date, dayNumber: number, orderType: number, isDeleted: boolean, isPaidReward: boolean, offset?: number, limit?: number, sortField?: string, isAsc = false) {
        let fDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        let tDate;
        if (toDate) {
            tDate = toDate.toISOString();
        }
        let fUpdate;
        if (fromUpdate) {
            fUpdate = fromUpdate.toISOString();
        }
        let tUpdate;
        if (toUpdate) {
            tUpdate = toUpdate.toISOString();
        }
        // tslint:disable-next-line: max-line-length
        const queryString = `${this.serviceUri}/GetForAdmin?key=${key}&idClient=${idClient}&ctv=${ctv}&idProduct=${idProduct}&status=${status}&fromDate=${fDate}&toDate=${tDate}&fromUpdate=${fUpdate}&toUpdate=${tUpdate}&dayNumber=${dayNumber}&orderType=${orderType}&isDeleted=${isDeleted}&isPaidReward=${isPaidReward}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    UpdateOrder(order: any) {
        const queryString = `${this.serviceUri}/UpdateOrder`;
        return this.defaultPost(queryString, order);
    }

    CancelShipOrder(shipCode: string, noteCancel: string) {
        const queryString = `${this.serviceUri}/CancelOrderAhamove?shipCode=${shipCode}&noteCancel=${noteCancel}`;
        return this.defaultGet(queryString);
    }

    CancelContact(id: number) {
        const queryString = `${this.serviceUri}/CancelContact/${id}`;
        return this.defaultPost(queryString, {});
    }

    PaymentCheck(code: any) {
        const queryString = `${this.serviceUri}/PaymentAlepayCheck/${code}`;
        return this.defaultGet(queryString);
    }

    GetLastOrderReport() {
        const queryString = `${this.serviceUri}/GetLastOrderReport`;
        return this.defaultGet(queryString);
    }

    GetLastOrderReportDN() {
        const queryString = `${this.serviceUri}/GetLastOrderReportDN`;
        return this.defaultGet(queryString);
    }

    GetTopChangeStatus() {
        const queryString = `${this.serviceUri}/GetTopChangeStatus`;
        return this.defaultGet(queryString);
    }

    GetShipFee(item: any) {
        const url = `${this.serviceUri}/GetShipFee`;
        return this.defaultPost(url, item);
    }

    Rating(item: any, idOrder: number) {
        const queryString = `${this.serviceUri}/Rating/${idOrder}`;
        return this.defaultPost(queryString, item);
    }

    Payment(id: number) {
        const url = `${this.serviceUri}/Payment/${id}`;
        return this.defaultGet(url);
    }

    Actions(item: any) {
        const queryString = `${this.serviceUri}/Actions`;
        return this.defaultPost(queryString, item);
    }

    MultiActions(item: any) {
        const queryString = `${this.serviceUri}/MultiActions`;
        return this.defaultPost(queryString, item);
    }

    ActionsActions(item: any) {
        const queryString = `${this.serviceUri}/ActionsActions`;
        return this.defaultPost(queryString, item);
    }

    OrdersEstimateFee(ids: any, idLogistics: string, voucher: string) {
        const url = `${this.serviceUri}/OrdersEstimateFee/?ids=${ids}&idLogistics=${idLogistics}&voucher=${voucher}`;
        return this.defaultGet(url);
    }

    OrdersShip(ids: any, idLogistics: string, voucher: string, note: string) {
        const url = `${this.serviceUri}/OrdersShip/?ids=${ids}&idLogistics=${idLogistics}&voucher=${voucher}&note=${note}`;
        return this.defaultGet(url);
    }

    MultiActionsActions(item: any) {
        const queryString = `${this.serviceUri}/MultiActionsActions`;
        return this.defaultPost(queryString, item);
    }

    GetAndSaveCODLogistics(id: number, logisticId: number, tranportId: string) {
        const queryString = `${this.serviceUri}/GetAndSaveCODLogistics/${id}?logisticId=${logisticId}&tranportId=${tranportId}`;
        return this.defaultPost(queryString, {});
    }

    ShowDeliveryDate(item: any) {
        const queryString = `${this.serviceUri}/ShowDeliveryDate`;
        return this.defaultPost(queryString, item);
    }
}
