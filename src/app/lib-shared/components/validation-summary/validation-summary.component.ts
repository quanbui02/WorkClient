import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { NotifierService } from '../../services/notifier.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'validation-summary',
    templateUrl: './validation-summary.component.html',
    styleUrls: ['./validation-summary.component.scss'],
    providers: [MessageService]
})
export class ValidationSummaryComponent implements OnInit, OnDestroy {


    @Input() formGroup: FormGroup;
    @Input() formElement: any;
    @Input() ngClass = 'ui-g-12 ui-md-12';

    errors: Message[] = [];

    errorString = '';

    constructor(
        private _messageService: NotifierService,
        private _mes: MessageService
    ) { }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        this.errors.length = 0;
    }


    resetErrorMessages() {
        this.errors.length = 0;
    }

    generateErrorMessages(formGroup: FormGroup) {
        // Object.keys(formGroup.controls).forEach(controlName => {
        this.errorString = '';

        for (const controlName in formGroup.controls) {
            const control = formGroup.controls[controlName];
            const errors = control.errors;

            if (errors === null || errors.count === 0) {
                continue;
            }
            // Handle the 'required' case
            const controlObj = this.formElement.querySelector(`[for='${controlName}']`);
            const controlText = controlObj ? controlObj.innerText : controlName;

            if (errors.pattern) {
                this.errors.push({ severity: 'error', summary: controlText, detail: `không đúng định dạng` });
                this.errorString += `${controlText} không đúng định dạng <br />`;
            }

            if (errors.incorrect) {
                this.errors.push({ severity: 'error', summary: controlText, detail: `không đúng` });
                this.errorString += `${controlText} không đúng<br />`;
            }

            if (errors.duplicate) {
                this.errors.push({ severity: 'error', summary: controlText, detail: `đã tồn tại` });
                this.errorString += `${controlText} đã tồn tại <br />`;
            }

            if (errors.nomatch) {
                this.errors.push({ severity: 'error', summary: controlText, detail: `đang không trùng nhau` });
                this.errorString += `${controlText} đang không trùng nhau <br />`;
            }

            if (errors.required) {
                this.errors.push({ severity: 'error', summary: controlText, detail: `không được để trống` });
                this.errorString += `${controlText} không được để trống <br />`;
                // this._messageService.showError(`${controlText} không được để trống`, this.toastKey);
            }

            // Handle 'minlength' case
            if (errors.minlength) {
                this.errors.push({ severity: 'error', summary: controlText, detail: `phải tối thiểu ${errors.minlength.requiredLength} ký tự.` });
                this.errorString += `${controlText} phải tối thiểu ${errors.minlength.requiredLength} ký tự. <br />`;
                // this._messageService.showError(`${controlText} không được dài quá ${errors.minlength.requiredLength} ký tự.`, this.toastKey);
            }
        }



        // this._messageService.showError(this.errorString);
        // });


    }

    showValidationSummary() {
        this.resetErrorMessages();
        this.generateErrorMessages(this.formGroup);
    }

    getLengthOfErrors() {
        return this.errors;
    }

    showError(summary: string, detail: string) {
        this.errors.push({ severity: 'error', summary: summary, detail: detail ? detail : `không được để trống` });
    }
}
