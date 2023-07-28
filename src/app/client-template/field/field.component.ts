import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
@Component({
    selector: 'app-field',
    styleUrls: ['./field.component.scss'],
    templateUrl: './field.component.html'
})

export class FieldComponent implements OnInit {
    display: boolean = false;
    displayInfo: boolean = false;
    khoa: SelectItem[];
    bo_mon: SelectItem[];
    selectRatio: string = 'val2';
    isPopupDelete: boolean = true;

    constructor() {
        this.khoa = [
            { label: 'Khoa', value: null }
        ];
        this.bo_mon = [
            { label: 'Select 1', value: null },
            { label: 'Select 1', value: null },
            { label: 'Select 1', value: null }
        ];
    }

    ngOnInit(): void {
    }

    showModal() {
        this.display = true;
    }

    showModalInfo() {
        this.displayInfo = true;
    }

    shopPopupDelete() {
        this.isPopupDelete = !this.isPopupDelete;
    }
}
