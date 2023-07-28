import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { BaseService } from '../../lib-shared/services/base.service';

@Injectable()
export class PromotionUsersGiftProductsService extends BaseService {
    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/PromotionUsersGiftProducts`
        );
    }

    getByIdPromotion(idPromotion: number) {
        const queryString = `${this.serviceUri}/getByIdPromotion?idPromotion=${idPromotion}`;
        return this.defaultGet(queryString);
    }
}
