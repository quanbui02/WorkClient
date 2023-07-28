import { Component, Injector, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { OrdersService } from '../../../services/orders.service';


@Component({
    selector: 'app-order-rating',
    templateUrl: './order-rating.component.html',
    styleUrls: ['./order-rating.component.scss']
})
export class OrderRatingComponent extends SecondPageEditBase implements OnInit {
    modelEdit: any = {};
    listImage: any[] = [];
    @ViewChild('fileUpload') fileUpload: FileUpload;
    @Input() isView = false;

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _OrdersService: OrdersService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {

        // this.formGroup = this.formBuilder.group({
        //     rating: [],
        //     comment: [],
        //     commentImages: []
        // });
    }

    save() {
        this.isView = true;
        this._OrdersService.Rating(this.modelEdit.orderDetails, this.modelEdit.id).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Đánh giá thành công');
                this.isShow = false;
                this.closePopup.emit(rs.data);
            } else {
                this._notifierService.showError(rs.message);
            }
            this.isView = false;
        });
    }

    async showPopup(id: any) {
        this.isShow = true;
        this.isView = false;
        this.togglePopupDelete();
        if (id) {
            this._OrdersService.Get(id).then(async response => {
                this.modelEdit = response.data;
            }, error => {
                this._notifierService.showHttpUnknowError();
            });
        } else {
            this.togglePopupDelete();
        }
    }

    togglePopupDelete(): any {
        this.modelEdit = {};
    }
}
