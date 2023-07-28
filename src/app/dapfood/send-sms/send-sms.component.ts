import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../lib-shared/classes/base/second-page-edit-base';
import { User } from '../../lib-shared/models/user';
import { LogSmsService } from '../services/logsms.service';
import { ProductService } from '../services/products.service';

@Component({
    selector: 'app-send-sms',
    templateUrl: './send-sms.component.html',
    styleUrls: ['./send-sms.component.scss']
})
export class SendSmsComponent extends SecondPageEditBase implements OnInit {
    modelEdit: any = {};
    isLoading = false;
    users: any;
    dataSource = [];
    key: string;
    total = 0;
    page = 1;
    limit = 100;
    user = new User();

    results: any;
    products = [];
    idProductChosse: number;
    productChoosed = [];
    message: string;

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _LogSmsService: LogSmsService,
        private _ProductService: ProductService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = new FormGroup({
            topCtv: new FormControl(''),
            topOrder: new FormControl(''),
            productName: new FormControl(''),
            name: new FormControl('')
        });
    }

    async autoComplete(event) {
        const query = event.query;
        let ids = '';
        if (this.dataSource != null) {
            ids = this.dataSource.map((obj) => obj.id).toString();
        }
        await this._ProductService.Autocomplete(
            query,
            (this.page - 1) * this.limit,
            this.limit
        ).then(rs => {
            if (rs.status) {
                this.results = rs.data;
                this.total = rs.totalRecord;
            }
        });
    }

    async sendSms() {
        this.isLoading = true;
        this.message = '';
        let ids = '';
        if (this.dataSource != null) {
            ids = this.products.map((obj) => obj.id).toString();
        }
        await this._LogSmsService.SendSMS(this.modelEdit.topCtv, this.modelEdit.topOrder, ids, this.modelEdit.idProductChoose, this.modelEdit.name).then(rs => {
            if (rs.status) {
                this.message = `Đã gửi tin nhắn thành công cho ${rs.totalRecord} sđt`;
                this._notifierService.showSuccess(`Đã gửi tin nhắn thành công cho ${rs.totalRecord} sđt`);
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.isLoading = false;
    }

    onSelect(event) {
        this.products.push(event);
        this.key = null;
    }
    onSelectChoose(event) {
        this.productChoosed.push(event);
        this.modelEdit.idProductChoose = event.id;
        this.key = null;
    }

    togglePopupDelete(): any {
        this.modelEdit = {};
    }
    onDelete(): any {
        this.products = [];
    }

    onDeleteChoose(): any {
        this.products = [];
    }
}
