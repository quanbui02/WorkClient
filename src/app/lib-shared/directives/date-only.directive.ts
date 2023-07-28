import { Directive, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: '[ngModel][psDateOnly]',
    providers: [NgModel],
    host: {
        '(ngModelChange)': 'onInputChange($event)'
    }
})
export class DateOnlyDirective {
    constructor(private model: NgModel) { }

    onInputChange(event) {
        if (event) {
            let val = new Date(event);
            val.setHours(12);
            this.model.valueAccessor.writeValue(val);
        }
    }
}
