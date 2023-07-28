import { Component, Injector, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { PromotionsService } from '../../services/promotions.service';
@Component({
    selector: 'app-promotion-UserUsed',
    templateUrl: './promotion-UserUsed.component.html',
    styleUrls: ['./promotion-UserUsed.component.scss']
})
export class PromotionUserUsedComponent extends SecondPageEditBase
    implements OnInit {
    item: any = {};
    cols = [];
    lstUserUsed = [];
    countUserUsed = 0;
    isLoading = false;
    constructor(
        protected _injector: Injector,
        protected _translateService: TranslateService,
        protected _promotionsService: PromotionsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
    }

    async showPopup(item: any) {
        this.isShow = true;
        this.item = item;
        this.GetData();
    }

    async GetData() {
        this.isLoading = true;
        this.lstUserUsed = [];
        this.countUserUsed = 0;
        if (this.item && this.item > 0) {
            await this._promotionsService.GetListUserUsedById(this.item, 0, 99999)
                .then(async response => {
                    if (response.status) {
                        this.lstUserUsed = response.data;
                        this.countUserUsed = response.totalRecord;
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        }
        this.isLoading = false;
    }
}

