import { Component, Injector, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { ProductService } from '../../../services/products.service';
import { ContentService } from '../../../services/contents.service';


@Component({
    selector: 'app-product-view',
    templateUrl: './product-view.component.html',
    styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends SecondPageEditBase
    implements OnInit {
    modelEdit: any = {};
    dataSource = [];

    constructor(
        protected _injector: Injector,
        private _ContentService: ContentService,
        private _ProductService: ProductService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {

    }

    async showPopup(item: any = {}) {
        this.isShow = true;
        this.dataSource = [];
        if (item) {
            this._ProductService.getDetailAll(item.id).then(async response => {
                this.modelEdit = response.data;
            }, error => {
                this._notifierService.showHttpUnknowError();
            });
            this.dataSource = [];
            this._ContentService.Gets(item.id, -1, 1)
                .then(async response => {
                    this.dataSource = response.data;
                }, error => {
                    this._notifierService.showHttpUnknowError();
                });
        } else {
            this.togglePopupDelete();
        }
    }

    copied() {
        this._notifierService.showSuccess('Copy thành công!');
    }
    formatNumber(i): string {
        try {
            const t = +i.toFixed(2);
            return (t).toLocaleString('vi-vn', { minimumFractionDigits: 0 });
        } catch {
            return '0';
        }
    }
}
