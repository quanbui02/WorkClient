import { Injectable } from '@angular/core';
import { ModuleConfigService } from './module-config.service';
import { VsModuleConfig } from '../models/module-config';
import { DatePipe } from '@angular/common';
import { ConfigurationService } from './configuration.service';
@Injectable()
export class VsCommonService {
    config: VsModuleConfig;
    constructor(
        private _moduleConfigService: ModuleConfigService,
        private _configurationService: ConfigurationService
    ) {
        this.config = _moduleConfigService.getConfig();
    }

    checkYear(tuNgay: Date, denNgay: Date, year: number): boolean {
        let tuYear = tuNgay.getFullYear();
        let denYear = denNgay.getFullYear();
        if (tuYear < year || denYear < year || tuYear > year + 1 || denYear > year + 1) {
            return false;
        }
        if (tuNgay < new Date('9-1-' + year) || tuNgay > new Date('6-1-' + (year + 1)) || denNgay < new Date('9-1-' + year) || denNgay > new Date('6-1-' + (year + 1))) {
            return false;
        }
        return true;
    }
    // Lấy về giá trị theo path ''
    getValueByPath(obj: any, path: string): string {
        const paths = path.split('.');
        for (let i = 0; i < paths.length; i++) {
            try {
                obj = obj[paths[i]];
            } catch (err) {
                obj = null;
            }

        }
        return obj;
    }

    exportToCSV(datas: any[], columns: any[], fileName: string): void {
        let headerString = '';
        // Duyệt cột để thêm vào header
        columns.forEach(c => {
            headerString += c.header + ',';
        });

        const rowsString: string[] = [];
        datas.forEach(d => {
            let rowString = '';
            columns.forEach(c => {
                // rowString += (typeof d[c.field]).toString() + ',';
                let colVal = '';
                if (c.dataPath) {
                    const colValTmp = this.getValueByPath(d, c.dataPath);
                    if (colValTmp) {
                        colVal = colValTmp;
                    }
                } else if (d[c.field]) {
                    colVal = d[c.field];
                }
                // Format Date
                if (c.dateFormat) {
                    const datePipe = new DatePipe('en-US');
                    colVal = datePipe.transform(colVal, c.dateFormat);
                }
                // Format mapping
                if (c.dataMapping) {
                    c.dataMapping.forEach(dm => {
                        if (dm.id === d[c.field]) {
                            colVal = dm.name.toString().replace(',', '.').replace('\n', '').replace('\r', '');
                        }
                    });
                }
                if (colVal) {
                    rowString += colVal.toString().replace(',', '.').replace('\n', '').replace('\r', '') + ',';
                } else {
                    rowString += '' + ',';
                }
            });
            rowsString.push(rowString);
        });
        let csv = headerString + '\n';
        for (const row of rowsString) {
            csv += row + '\n';
        }
        const blob = new Blob(['\uFEFF', csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(blob));
        link.setAttribute('download', fileName + '.csv');
        document.body.appendChild(link); // Required for FF
        link.click();
    }

    refreshLogSession() {
        const newKey = this.genGuid();
        sessionStorage.setItem(this._configurationService.logSessionKey, newKey);
    }

    genGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
