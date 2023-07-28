import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phantram' })
export class PhanTramPipe implements PipeTransform {
    transform(value: any): any {
        if (value != null && value !== '') {
            return +value.toFixed(2) + '%';
        }
        return '';
    }
}
