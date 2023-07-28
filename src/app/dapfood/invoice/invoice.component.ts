import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { OrderClientEditComponent } from '../doanh-nghiep/order-client/order-client-edit/order-client-edit.component';
import { VnInvoiceService } from '../services/vninvoices.service';

declare var omiSDK: any;
@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        fromDate: new Date(),
        toDate: new Date()
    };
    total = 0;
    page = 1;
    limit = 100;
    sortField = '';
    vi: any;

    @ViewChild(OrderClientEditComponent) _orderEdit: OrderClientEditComponent;

    constructor(
        protected _injector: Injector,
        private _VnInvoiceService: VnInvoiceService,
        private _configurationService: ConfigurationService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.searchModel.fromDate.setDate(this.searchModel.fromDate.getDate() - 30);
        this.loadTableColumnConfig();
        await this.getData();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'invoiceDate',
                header: 'Ngày hóa đơn',
                visible: true,
                sort: false,
                width: '5%'
            },
            {
                field: 'serialNo',
                header: 'Ký hiệu hóa đơn',
                visible: true,
                sort: true,
                width: '7%'
            },
            {
                field: 'invoiceNo',
                header: 'Số hóa đơn',
                align: 'center',
                visible: true,
                sort: false,
                width: '5%'
            },
            {
                field: 'note',
                header: 'Ghi chú',
                align: 'center',
                visible: false,
                sort: false,
                width: '5%'
            },
            {
                field: 'totalAmount',
                header: 'Tổng tiền hàng',
                align: 'center',
                visible: true,
                sort: false,
                width: '8%'
            },
            {
                field: 'totalPaymentAmount',
                header: 'Tổng tiền thanh toán',
                visible: true,
                sort: false,
                width: '10%'
            },
            {
                field: 'buyerCode',
                header: 'Mã khách hàng',
                visible: true,
                sort: false,
                width: '7%'
            },
            {
                field: 'buyerFullName',
                header: 'Đơn vị mua hàng',
                visible: true,
                sort: false,
                // width: '13%'
            },
            {
                field: 'buyerTaxCode',
                header: 'Mã số thuế bên mua',
                visible: true,
                sort: false,
                width: '7%'
            },
            {
                field: 'sellerFullName',
                header: 'Đơn vị xuất',
                visible: true,
                sort: true,
                // width: '7%'
            },
            {
                field: 'sellerTaxCode',
                header: 'Mã số thuế bên xuất',
                visible: true,
                sort: false,
                dataType: 'number',
                width: '7%',
                // align: 'right'
            },
            {
                field: 'idOrders',
                header: 'Đơn hàng',
                visible: true,
                sort: false,
                width: '7%',
                // align: 'right'
            },
        ];
    }


    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._VnInvoiceService.Gets(

            this.searchModel.key,
            this.searchModel.fromDate,
            this.searchModel.toDate,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
                this.dataTotal = [rs.dataTotal];
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    onSearch() {
        this.getData();
    }

    toggleSearch() {
        super.toggleSearch();
        this.fixTableScrollProblem();
    }
    onChangeRowLimit() {
        this.fixTableScrollProblem();
    }
    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    fixTableScrollProblem() {
        this.dataSource = [...this.dataSource];
    }
    // onCloseForm() {
    //   this.getData();
    // }


    async SynInfoInvoice(item: any) {
        this.resetBulkSelect();
    }

    async SynMultiInfoInvoice() {
        if (this.dataSource.filter(d => d.checked == true).length <= 0) {
            this._notifierService.showError("Chọn hóa đơn để đồng bộ!");
            return false;
        }

        this.resetBulkSelect();
    }

    onShowLink(id: any) {
        this._orderEdit.showPopup(id);
    }

    // onShowDetailUserCurr(id) {
    //     this.ref = this.dialogService.open(CustomerInfoComponent, {
    //         data: {
    //             userId: id
    //         },
    //         header: 'Thông tin khách hàng',
    //         width: '80%',
    //         height: 'calc(100vh - 100px)',
    //         styleClass: "vs-modal",
    //         contentStyle: { 'overflow': 'auto' }, //'max-height': 'calc(100vh - 180px);', 
    //         baseZIndex: 1001,
    //         closeOnEscape: true
    //     });

    //     this.ref.onClose.subscribe((re: any) => {
    //         if (re != null) {
    //             this.isLoading = false;
    //         }
    //     });
    // }

    getLinkCall(strId: string): string {
        if (strId.includes('orderid_')) {
            let id = strId.replace("orderid_", "");
            return 'Đơn hàng ' + id;
        }
        else if (strId.includes('UserId_')) {
            let id = strId.replace("UserId_", "");
            return 'Khách hàng ' + id;
        }
    }
    downloadPdf(base64Data, fileName) {
        let pdfWindow = window.open("");
        pdfWindow.document.write("<html<head><title>" + fileName + "</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>");
        pdfWindow.document.write("<body><embed width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(base64Data) + "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>");

    }
    async onClickDownloadPdf(item: any) {
        this.isLoading = true;
        await this._VnInvoiceService.PrintUnOfficial(item.id).then(re => {
            //console.log("view hoa don the hien = " + JSON.stringify(re));
            if (re.status) {
                this.downloadPdf(re.data.data.data, item.id);
                this.isLoading = false;
            }
            else {
                this._notifierService.showError(re.message);
                this.isLoading = false;
            }
        });
    }
}
