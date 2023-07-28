import { Directive, Input, Output, HostListener, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';

@Directive({
    selector: '[confirmSwal]'
})
export class ConfirmSwalDirective {
    // tslint:disable-next-line:no-output-rename
    @Input('confirm-title') title: string;
    @Input('confirm-text') text: string;
    @Output('confirm-click') click: any = new EventEmitter();
    @HostListener('click', ['$event']) clicked(e) {
        const _this = this;
        swal({
            title: this.title,
            text: this.text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có. Tôi chắc chắn!',
            cancelButtonText: 'Đóng'
        }).then((result) => {
            if (result.value) {
                _this.click.emit();
            }
        });
    }

    constructor() { }
}
