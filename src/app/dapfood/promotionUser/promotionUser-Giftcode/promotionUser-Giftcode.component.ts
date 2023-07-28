import { Component, Injector, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { PromotionUsersService } from '../../services/promotionUsers.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
    selector: 'app-promotionUser-Giftcode',
    templateUrl: './promotionUser-Giftcode.component.html',
    styleUrls: ['./promotionUser-Giftcode.component.scss']
})
export class PromotionUserGiftcodeComponent extends SecondPageEditBase
    implements OnInit {
    item: any = {};
    cols = [];
    dataSource = [];
    total = 0;
    isLoading = false;
    listItemNumberPerPage = [
        { label: '20', value: 20 },
        { label: '50', value: 50 },
        { label: '100', value: 100 },
        { label: '200', value: 200 },
        { label: '500', value: 500 },
        { label: '1000', value: 1000 },
    ];
    constructor(
        protected _injector: Injector,
        protected _translateService: TranslateService,
        protected _promotionUsersService: PromotionUsersService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.loadTableColumnConfig();
    }

    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'code',
                header: 'Mã',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'userName',
                header: 'Người kích hoạt',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'idOrder',
                header: 'Mã đơn hàng',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'updatedDate',
                header: 'Ngày sử dụng',
                visible: true,
                align: 'center',
                dataType: 'date',
                sort: true
            },
            {
                field: 'name',
                header: 'Trạng thái đơn',
                visible: true,
                align: 'center',
                sort: true
            },
            {
                field: 'isActived',
                header: 'Trạng thái',
                visible: true,
                align: 'center',
                sort: false
            }
        ];
    }

    async showPopup(item: any) {
        this.isShow = true;
        this.item = item;
        this.GetData();
    }

    exportExcel() {
        const data = [];
        this.dataSource.forEach(item => {
            const row = {};
            this.cols.forEach(col => {
                let celValue = item[col.field];
                if (celValue) {// Format Date
                    if (col.dataType === 'date') {
                        celValue = moment.utc(celValue).format('YYYY-MM-DD HH:mm');
                    }
                    if (col.dataType === 'number') {
                        celValue = (celValue).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
                    }
                }
                row[col.header] = celValue;
            });
            data.push(row);
        });
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "DanhSachMaVoucher");
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    async GetData() {
        this.isLoading = true;
        this.dataSource = [];
        this.total = 0;
        if (this.item && this.item > 0) {
            await this._promotionUsersService.GetGiftcode("", -1, "", -1, this.item, 0, 99999)//code: string, idOrder: number, username: string, isActive: number
                .then(async response => {
                    if (response.status) {
                        this.dataSource = response.data;
                        this.total = response.totalRecord;
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        }
        this.isLoading = false;
    }
}

