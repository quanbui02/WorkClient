import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { NotifierService } from '../../../../lib-shared/services/notifier.service';
import { OrderGiftsService } from '../../../services/ordergift.service';
import { GiftsService } from '../../../services/vouchers.service';

@Component({
    selector: 'app-choose-gift',
    templateUrl: './choose-gift.component.html',
    styleUrls: ['./choose-gift.component.scss']
})
export class ChooseGiftComponent implements OnInit {
    searchModel: any = {
        key: '',
        type: -1
    };
    isLoading = false;
    total = 0;
    page = 1;
    limit = 100;
    listGifts = [];

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public _PromotionsService: OrderGiftsService,
        public _notifierService: NotifierService,
        public _VouchersService: GiftsService
    ) { }

    async ngOnInit() {
        this.listGifts = [];
        // this.listGifts.push({ type: 1, name: 'Miễn phí vận chuyển', value: this.config.data.ship });
        // this.listGifts.push({ id: 2, type: 2, name: 'Voucher 10K', value: 10000 });
        // this.listGifts.push({ id: 5, type: 3, name: 'Sản phẩm muối tắm', idProduct: 4008 });

        // if (this.config.data.ids != '') {
        await this.GetVouchers();
        // }

        this.config.data.orderDetails.forEach(item => {
            this.listGifts.push({ type: 3, name: item.name, idProduct: item.idProduct, quantity: 1, value: item.price });
        });
    }

    async GetVouchers() {
        this.isLoading = true;
        await this._VouchersService.GetShort().then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    if (item.type === 1) {
                        this.listGifts.push({ idGift: item.id, type: item.type, name: item.name, value: this.config.data.ship });
                    } else {
                        this.listGifts.push({ idGift: item.id, type: item.type, name: item.name, value: item.value });
                    }
                });
            }
        });
        this.isLoading = false;
    }

    // selected(item: any) {

    //     this.orderGifts.push(item);
    // }

    closeAndSelected() {
        const totalGift = this.listGifts.filter(s => s.checked === true).map(s => s.value).reduce((total, num) => total + num);
        if (totalGift > this.config.data.totalReward) {
            this._notifierService.showError('Quà tặng không được vượt quá hoa hồng');
            return;
        }
        this.ref.close(this.listGifts.filter(s => s.checked === true));
    }


}
