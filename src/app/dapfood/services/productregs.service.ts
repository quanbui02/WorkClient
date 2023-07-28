import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../lib-shared/services/base.service';


@Injectable()
export class ProductRegService extends BaseService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/ProductRegs`);
    }

    MyProducts(key: string, category: number, status: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/MyProducts?key=${key}&category=${category}&status=${status}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    Gets(key: string, idClient: number, idProduct: number, status: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&idClient=${idClient}&idProduct=${idProduct}&status=${status}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    Autocomplete(key: string, ids: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/Autocomplete?key=${key}&ids=${ids}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString); // '/assets/countries.json'
    }

    AutocompleteShop(key: string, ids: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/AutocompleteShop?key=${key}&ids=${ids}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString); // '/assets/countries.json'
    }

    AddFavorite(idProduct: number) {
        const queryString = `${this.serviceUri}/AddFavorite/${idProduct}`;
        return this.defaultPost(queryString, {});
    }
}

