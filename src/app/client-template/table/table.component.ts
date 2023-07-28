import { Component, OnInit, Injector } from '@angular/core';
import { PageIndexBase } from '../../lib-shared/classes/base/page-index-base';
import { ExportService } from '../../lib-shared/services/export.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent extends PageIndexBase implements OnInit {
    listItemNumberPerPage;
    selectedItemNumberPerPage;
    columns;
    openLeftTableSidebar = true;

    termStatus: any[];
    years: any[];
    searchModel: any = {};

    openColumnList = false;
    keyword = '';

    constructor(
        private _exportService: ExportService,
        protected _injector: Injector
    ) {
        super(_injector);
        for (let i = 1; i < 25; i++) {
            const fake = {
                'maLop': i,
                'tenLop': i,
                'tenHocPhan': i,
                'soTC': i,
                'countSVDky': i,
                'countSVRemoveDky': i,
                'giangVien': i,
                'phongHoc': i,
                'trangThai': 1

            };
            this.dataSource.push(fake);
        }

        this.total = this.dataSource.length;

        this.listItemNumberPerPage = [
            { label: '10', value: 10 },
            { label: '50', value: 50 },
            { label: '100', value: 100 },
        ];

        this.termStatus = [
            { label: '-- Trạng thái duyệt --', value: 0 },
            { label: 'Chưa duyệt', value: 1 },
            { label: 'Đã duyệt', value: 2 }
        ];

        this.years = [
            { label: '2019', value: 2019 },
            { label: '2017', value: 2017 },
            { label: '2018', value: 2018 }

        ];
    }

    ngOnInit(): void {
        this.searchModel.termStatus = 0;
        this.searchModel.year = 2019;

        this.cols = [
            { field: 'maLop', header: 'Mã lớp', visible: true, width: 'auto' },
            { field: 'tenLop', header: 'Tên lớp', visible: true, width: 'auto' },
            {
                field: 'tenHocPhan',
                header: 'Tên học phần',
                visible: true,
                width: 'auto',
                sort: true
            },
            { field: 'soTC', header: 'Số TC', visible: true, width: 'auto', sort: true },
            {
                field: 'countSVDky',
                header: 'Số lượng SV đăng ký',
                visible: true,
                width: 'auto',
                sort: true
            },
            {
                field: 'countSVRemoveDky',
                header: 'Số lượng SV huỷ đăng ký',
                visible: true,
                width: 'auto',
                sort: true
            },
            {
                field: 'giangVien',
                header: 'Giảng viên',
                visible: true,
                width: 'auto',
                sort: true
            },
            {
                field: 'phongHoc',
                header: 'Phòng học',
                visible: true,
                width: 'auto',
                sort: true
            },
            {
                field: 'trangThai',
                header: 'Trạng thái',
                visible: true,
                width: 'auto',
                sort: true
            }
        ];
    }

    toggleLeftTableSidebar() {
        this.openLeftTableSidebar = !this.openLeftTableSidebar;
    }

    toggleColumnList() {
        this.openColumnList = !this.openColumnList;
    }
}
