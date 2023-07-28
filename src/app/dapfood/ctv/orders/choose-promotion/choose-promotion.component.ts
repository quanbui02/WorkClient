import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { PromotionsService } from '../../../services/promotions.service';

@Component({
    selector: 'app-choose-promotion',
    templateUrl: './choose-promotion.component.html',
    styleUrls: ['./choose-promotion.component.scss']
})
export class ChoosePromotionComponent implements OnInit {
    searchModel: any = {
        key: '',
        type: -1
    };
    isLoading = false;
    total = 0;
    page = 1;
    limit = 100;
    promotions = [];

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public _PromotionsService: PromotionsService
    ) { }

    ngOnInit() {
        if (this.config.data.ids != '') {
            this.getData();
        }
    }

    async getData() {
        this.isLoading = true;
        this.promotions = [];
        await this._PromotionsService.GetByOrder(
            this.searchModel.key,
            this.config.data.ids,
            this.config.data.quantity,
            this.config.data.totalBill,
            (this.page - 1) * this.limit,
            this.limit,
            ''
        ).then(rs => {
            if (rs.status) {
                this.promotions = rs.data;
                // this.total = rs.totalRecord;
            }
        });
        this.isLoading = false;
    }

    selected(item: any) {
        this.ref.close(item);
    }


}
