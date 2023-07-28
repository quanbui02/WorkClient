import { Component, Injector, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { PromotionUsersService } from '../../services/promotionUsers.service';
@Component({
    selector: 'app-promotionUser-UserUsed',
    templateUrl: './promotionUser-UserUsed.component.html',
    styleUrls: ['./promotionUser-UserUsed.component.scss']
})
export class PromotionUserUserUsedComponent extends SecondPageEditBase
    implements OnInit {
    item: any = {};
    cols = [];
    lstUserUsed = [];
    countUserUsed = 0;
    isLoading = false;
    constructor(
        protected _injector: Injector,
        protected _translateService: TranslateService,
        protected _promotionUsersService: PromotionUsersService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
    }

    async showPopup(item: any) {
        this.isShow = true;
        this.item = item;
        this.GetData(1);
    }

    async showPopup2(item: any, mode: any) {
        this.isShow = true;
        this.item = item;
        this.GetData(mode);
    }

    async GetData(mode: any) {
        console.log(mode);
        this.isLoading = true;
        this.lstUserUsed = [];
        this.countUserUsed = 0;
        if (this.item && this.item > 0) {
            await this._promotionUsersService.GetListUserUsedById(this.item, mode, 0, 99999)
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

