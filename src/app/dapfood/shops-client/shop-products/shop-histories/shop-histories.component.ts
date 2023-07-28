import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SecondPageIndexBase } from '../../../../lib-shared/classes/base/second-page-index-base';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { ShopsService } from './../../../services/shops.service';
@Component({
    selector: 'app-shop-histories',
    templateUrl: './shop-histories.component.html',
    styleUrls: ['./shop-histories.component.scss']
})
export class ShopHistoriesComponent extends SecondPageIndexBase
    implements OnInit {
    item: any = {};
    cols = [];
    dataSource = [];
    isLoading = false;
    isShow = false;

    constructor(
        protected _injector: Injector,
        protected _translateService: TranslateService,
        protected _shopsService: ShopsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.loadTableColumnConfig();
    }
    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'id',
                header: 'ID',
                visible: true,
                align: 'center',
            },
            {
                field: 'code',
                header: 'Mã',
                visible: true,
                align: 'center',
            },
            {
                field: 'name',
                header: 'Tên sản phẩm',
                visible: true,
                align: 'center',
            },
            {
                field: 'quantity',
                header: 'Số lượng',
                visible: true,
                align: 'right',
            },
            {
                field: 'quantityInventory',
                header: 'Tồn kho',
                visible: true,
                align: 'right',
            },
            {
                field: 'userName',
                header: 'Người tạo',
                visible: true,
            },
            {
                field: 'createdDate',
                header: 'Ngày tạo',
                visible: true,
                align: 'center',
            }
            ,
            {
                field: 'operaName',
                header: 'Lý do',
                visible: true,
                align: 'center',
            }
        ];
    }

    async showPopup(item: any) {
        this.isShow = true;
        this.item = item;
        this.GetData();
    }

    onChangeRowLimit() {

    }

    closePopupMethod(data: any) {
        this.isShow = false;
        this.item = null;
    }

    async GetData() {
        var id = -1;
        if (this.item.idProduct && this.item.idProduct > 0) {
            id = this.item.idProduct;
        }
        await this._shopsService.GetShopHistories(id,
            -1,
            -1,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField).then(rs => {
                if (rs.status) {
                    this.dataSource = rs.data;
                    this.total = rs.totalRecord;
                }
            });
    }
}

