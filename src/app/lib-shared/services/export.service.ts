import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { CommonService } from './common.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const DOCX_EXTENSION = '.docx';
// const apiEndpoint = environment.apiDomain.inspectorateEndPoint + '/Export';

@Injectable({
    providedIn: 'root'
})
export class ExportService {
    _http: HttpClient;

    constructor(
        private http: HttpClient,
        private _commonService: CommonService,
        private _injector: Injector
    ) {
        this._http = http;
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    export(data: any[], cols: any[], fileName: string) {
        // const obj = {
        //     data: data,
        //     cols: cols
        // };
        // return this._http
        //     .post(`${apiEndpoint}/export`, obj, { responseType: 'blob' as 'json' })
        //     .pipe(catchError((err: HttpErrorResponse) => this._commonService.handleError(err, this._injector)))
        //     .subscribe(res => {
        //         this.saveAsExcelFile(res, fileName);
        //     });
    }

    saveAsDocFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: DOCX_TYPE
        });
        FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + DOCX_EXTENSION);
    }
}
