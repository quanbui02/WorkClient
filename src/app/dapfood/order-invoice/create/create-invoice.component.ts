import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Utilities } from '../../../shared/utilities';
import { CompanysService } from '../../services/companys.service';
import { EInvoicesService } from '../../services/einvoices.service';
import { InvoiceTemplatesService } from '../../services/invoicetemplates.service';

@Component({
    selector: 'app-create-invoice',
    templateUrl: './create-invoice.component.html',
    styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent extends SecondPageEditBase implements OnInit {
    public loading = new Array(4);
    modelEdit: any = {
        idCompany: '',
        idInvoiceTemplates: '',
    };
    agentInvite: any = {};
    isLoading = false;
    isSaving = false;
    isDeleting = false;
    isView = false;
    userTypeDataSource = [];
    captchaUrl = '';
    captchaInvalid = false;
    role_options: any[];
    list_Order: any = [];
    list_Companys: any = [];
    list_InvoiceTemplate: any = [];
    titleheader: string = 'Tạo hóa đơn';
    typeinvoice: number = 0;
    ids = [];

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _companysService: CompanysService,
        private _invoiceTemplatesService: InvoiceTemplatesService,
        private _einvoicesService: EInvoicesService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {

        this.formGroup = this.formBuilder.group({
            idCompany: '',
            idInvoiceTemplates: ''
        });
        this.role_options = [
            { label: 'Sale', value: 'Sale' },
            { label: 'Trưởng nhóm sale', value: 'Trưởng nhóm sale' },
            { label: 'Trưởng phòng Kinh Doanh', value: 'Trưởng phòng Kinh Doanh' },
            { label: 'Kế toán', value: 'Kế toán' },
            { label: 'Giám đốc', value: 'Giám đốc' }
        ];
    }

    async loadCompanys() {
        this.list_Companys = [];
        await this._companysService.Gets().then(rs => {
            if (rs.status) {
                //console.log("du lieu cty: " + JSON.stringify(rs.data));
                rs.data.forEach(item => {
                    this.list_Companys.push({ label: item.taxCode + ' - ' + item.fullName, value: item.taxCode });
                });
            }
        });
    }

    async loadInvoiceTemplate() {
        this.list_InvoiceTemplate = [];
        if (this.modelEdit.idCompany && this.modelEdit.idCompany !== '') {
            await this._invoiceTemplatesService.GetByIdCompany(this.modelEdit.idCompany).then(rs => {
                if (rs.status) {
                    // console.log("ma so thue cty: " + this.modelEdit.idCompany);
                    // console.log("mau hoa don: " + JSON.stringify(rs.data));
                    rs.data.forEach(item => {
                        this.list_InvoiceTemplate.push({ label: item.name, value: item.templateNo + "_" + item.serialNo });
                    });
                }
            });
        }
    }

    async save() {

        if (!this.modelEdit.idCompany || this.modelEdit.idCompany === '') {
            this._notifierService.showWarning('Vui lòng chọn đơn vị xuất hóa đơn!');
            return;
        }

        this.isLoading = true;
        // tạo hóa đơn truyền vào 
        //typeinvoice: kiểu hóa đơn 0-xuất lẻ , 1- xuất gộp.
        //idCompany: id đơn vị xuất hóa đơn
        //templateNo, serialNo: mẫu hóa đơn cần xuất
        //ids: list id danh sách đơn hàng cần xuất hóa đơn 
        let arrInvoiceTemplate = this.modelEdit.idInvoiceTemplates.split('_');
        await this._einvoicesService.CreateInvoice(this.typeinvoice, this.modelEdit.idCompany, arrInvoiceTemplate[0], arrInvoiceTemplate[1], this.ids.toString()).then(createresponse => {
            //console.log("log tạo hóa đơn= " + JSON.stringify(createresponse));
            if (createresponse.status) {
                this.isSaving = true;
                this._notifierService.showSuccess('Tạo hóa đơn thành công!');
                this.isShow = false;
                this.isLoading = false;
                this.closePopup.emit();
            } else {
                this.isSaving = false;
                this._notifierService.showWarning('Khởi tạo hóa đơn không thành công.\nNội dung lỗi: ' + createresponse.message);
                this.isShow = false;
                this.isLoading = false;
                this.closePopup.emit();
            }
        }).catch(error => {
            this.isSaving = false;
            this._notifierService.showWarning(Utilities.getErrorDescription(error));
            this.isShow = false;
            this.isLoading = false;
            this.closePopup.emit();
        });

    }

    async showPopup(item: any) {
        //console.log("danh sach don hang can xuat = " + JSON.stringify(item));
        //this.isLoading = true;
        this.isShow = true;
        this.list_Order = item.data;
        this.loadCompanys();
        this.loadInvoiceTemplate();
        this.typeinvoice = item.typeinvoice;
        this.ids = item.ids;
        if (item.typeinvoice == 0)
            this.titleheader = 'Xuất hóa đơn cho danh sách đơn hàng';
        else if (item.typeinvoice == 1)
            this.titleheader = 'Xuất gộp hóa đơn cho danh sách đơn hàng';
    }

}
