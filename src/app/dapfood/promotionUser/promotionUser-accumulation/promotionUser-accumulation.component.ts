import { Component, Injector, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { PromotionUsersService } from '../../services/promotionUsers.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
    selector: 'app-promotionUser-accumulation',
    templateUrl: './promotionUser-accumulation.component.html',
    styleUrls: ['./promotionUser-accumulation.component.scss']
})
export class PromotionUserAccumulationComponent extends SecondPageEditBase
    implements OnInit {
    item: any = {};
    cols = [];
    dataSource = [];
    ids = [];
    total = 0;
    isLoading = false;
    isCheckAll = false;
    isMultiEdit = false;
    isShow = false;
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
                field: 'userId',
                header: 'Mã',
                visible: true,
                width: '5%',
                sort: true
            },
            {
                field: 'name',
                header: 'Cộng tác viên',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'phone',
                header: 'SĐT',
                visible: true,
                width: '20%',
                sort: true
            },
            {
                field: 'accumulation',
                header: 'Tích lũy',
                visible: true,
                align: 'center',
                dataType: 'number',
                sort: true
            },
            {
                field: 'quantity',
                header: 'Số lượng SP',
                visible: true,
                align: 'center',
                dataType: 'number',
                sort: true
            }
        ];
    }

    async showPopup(item: any) {
        this.isShow = true;
        this.item = item;
        await this.GetData();
    }

    async executionAccumulation(id: any) {
        this._promotionUsersService.ExecutionAccumulation(this.item, id).then(async rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                await this.GetData();
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    onRowSelect(event) {
        this.ids.push(event.data.userId);
        event.data.checked = true;

        this.isMultiEdit = this.ids.length > 0 ? true : false;
        this.isCheckAll = this.ids.length === this.dataSource.length ? true : false;
        console.log(this.ids);
    }
    onRowUnselect(event) {
        this.ids.splice(this.ids.indexOf(event.data.userId), 1);
        event.data.checked = false;

        this.isMultiEdit = this.ids.length > 0 ? true : false;
        this.isCheckAll = this.ids.length === this.dataSource.length ? true : false;
        console.log(this.ids);
    }

    onCheckAll(ev) {
        console.log(ev.target.checked);
        if (ev.target.checked) {
            this.isCheckAll = true;
            this.ids = [];
            for (let i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].checked = true;
                this.ids.push(this.dataSource[i].userId);
            }
        } else {
            this.isCheckAll = false;
            this.ids = [];
            for (let i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].checked = false;
            }
        }
        this.isMultiEdit = this.ids.length > 0 ? true : false;
        console.log(this.ids);
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
            await this._promotionUsersService.GetAccumulation(this.item, 0, 99999)
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

