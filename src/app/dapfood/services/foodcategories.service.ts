import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class FoodCategoriesService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(
            http,
            injector,
            `${environment.apiDomain.dapFoodEndPoint}/FoodCategories`
        );
    }

    Gets(key: string, cate: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}?key=${key}&cate=${cate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    searchTree(key: string) {
        const queryString = `${this.serviceUri}/searchTree?key=${key}`;
        return this.defaultGet(queryString);
    }
    searchDropdown(key: string, isAll: boolean = false) {
        const queryString = `${this.serviceUri}/searchDropdown?key=${key}&isAll=${isAll}`;
        return this.defaultGet(queryString);
    }
    GetShort(idParent: number, key: string, isShowPrivate: number) {
        const queryString = `${this.serviceUri}/GetShort?idParent=${idParent}&key=${key}&isShowPrivate=${isShowPrivate}`;
        return this.defaultGet(queryString);
    }
}
