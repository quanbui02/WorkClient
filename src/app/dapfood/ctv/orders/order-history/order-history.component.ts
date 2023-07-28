import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { OrderStatus } from '../../../models/orderstatus';
import { OrderStatusService } from '../../../services/orderstatus.service';
@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent extends SecondPageEditBase
    implements OnInit {
    item: any = {};
    cols = [];
    dataSource = [];
    isLoading = false;
    constructor(
        protected _injector: Injector,
        protected _translateService: TranslateService,
        protected _OrderStatusService: OrderStatusService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.loadTableColumnConfig();
    }
    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'createdDate',
                header: 'Thời gian',
                dataType: 'date',
                visible: true,
                align: 'center',
                width: '20%'
            },
            {
                field: 'name',
                header: 'Trạng thái',
                visible: true,
                align: 'center',
                width: '20%',
            },
            {
                field: 'note',
                header: 'Ghi chú',
                visible: true,
                width: '40%',
            }
        ];
    }

    async showPopup(item: any) {
        this.isShow = true;
        this.item = item;
        this.GetData();
    }

    async GetData() {
        await this._OrderStatusService.GetByIdOrder(this.item.id).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
            }
        });
    }
}

