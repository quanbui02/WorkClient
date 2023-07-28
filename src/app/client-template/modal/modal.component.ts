import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
interface City {
    name: string,
    code: string
}

@Component({
    selector: 'app-modal',
    styleUrls: ['./modal.component.scss'],
    templateUrl: './modal.component.html'
})

export class ModalComponent implements OnInit {
    @ViewChild('basicfileinput') input;
    display: boolean = false;
    displayInfo: boolean = false;
    khoa: SelectItem[];
    bo_mon: SelectItem[];
    selectRatio: string;
    cities2: City[];
    openPopupDelete: boolean = false;

    constructor() {
        this.khoa = [
            { label: 'Khoa', value: null }
        ];
        this.bo_mon = [
            { label: 'Bộ môn', value: null }
        ];
        this.cities2 = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    }

    ngOnInit(): void {
        this.showModal();
    }

    showModal() {
        this.display = true;
    }

    showModalInfo() {
        this.displayInfo = true;
    }

    togglePopupDelete() {
        this.openPopupDelete = !this.openPopupDelete;
    }

    getMaxDialogHeight() {
        return (window.innerHeight - 200).toString() + 'px';
    }
}
