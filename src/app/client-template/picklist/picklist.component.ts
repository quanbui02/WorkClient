import { Component, Injector, OnInit } from '@angular/core';

@Component({
    selector: 'app-picklist',
    templateUrl: './picklist.component.html',
    styleUrls: ['./picklist.component.scss']
})
export class PicklistComponent implements OnInit {
    display = true;
    cols;
    dataSourceLeft = [];
    dataSourceRight = [];
    selectedDataLeft = [];
    selectedDataRight = [];

    constructor(
        protected _injector: Injector
    ) {
        for (let i = 1; i < 25; i++) {
            const fake = {
                'maLop': i,
                'tenLop': i,
                'tenHocPhan': i,
                'soTC': i,
                'hocKy': i
            };
            this.dataSourceLeft.push(fake);
        }

        for (let i = 25; i < 30; i++) {
            const fake = {
                'maLop': i,
                'tenLop': i,
                'tenHocPhan': i,
                'soTC': i,
                'hocKy': i
            };
            this.dataSourceRight.push(fake);
        }
    }

    ngOnInit(): void {
        this.cols = [
            {field: 'maLop', header: 'Mã lớp', visible: true, width: 'auto'},
            {field: 'tenLop', header: 'Tên lớp', visible: true, width: 'auto'},
            {
                field: 'tenHocPhan',
                header: 'Tên học phần',
                visible: true,
                width: 'auto',
                sort: true
            },
            {field: 'soTC', header: 'Số TC', visible: true, width: 'auto', sort: true},
            {
                field: 'hocKy',
                header: 'hocKy',
                visible: true,
                width: 'auto',
                sort: true
            }
        ];
    }

    getMaxWidthDialog() {
        return (window.innerHeight - 200).toString() + 'px';
    }

    chuyenTraiSangPhai() {
        this.doChuyen(this.dataSourceLeft, this.selectedDataLeft, this.dataSourceRight);
    }

    chuyenPhaiSangTrai() {
        this.doChuyen(this.dataSourceRight, this.selectedDataRight, this.dataSourceLeft);
    }

    chuyenTraiSangPhaiAll() {
        this.doChuyenAll(this.dataSourceLeft, this.dataSourceRight);
        this.dataSourceLeft = [];
    }

    chuyenPhaiSangTraiAll() {
        this.doChuyenAll(this.dataSourceRight, this.dataSourceLeft);
        this.dataSourceRight = [];
    }

    doChuyen(danhSachChuyen: any[], listData: any[], danhSachNhan: any[]) {
        let i = 0;
        while (listData.length > 0) {
            danhSachNhan.push(listData[i]);

            for (const j in danhSachChuyen) {
                if (listData[i].maLop === danhSachChuyen[j].maLop) {
                    listData.splice(+i, 1);
                    danhSachChuyen.splice(+j, 1);
                    i--;
                    break;
                }
            }
            i++;
        }
    }

    doChuyenAll(danhSachChuyen: any[], danhSachNhan: any[]) {
        danhSachChuyen.forEach(item => {
            danhSachNhan.push(item);
        });
    }
}
