import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class ProductTnCategoriesService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(
            http,
            injector,
            `${environment.apiDomain.dapFoodEndPoint}/ProductTnCategories`
        );
    }

    searchTree(idProduct: number) {
        const queryString = `${this.serviceUri}/searchTree?idProduct=${idProduct}`;
        return this.defaultGet(queryString);
    }
}
