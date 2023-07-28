import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'vsnumber' })
export class VsNumberPipe implements PipeTransform {
    transform(value: any, decimal: any): string {

        if (value == null) return value;

        value = parseFloat(value).toFixed(decimal)  // decimal: dùng mấy số sau thập phân

        let list = value.toString().split('.');
        // Nếu là số thập phân
        if (list.length > 1) {
            let first = list[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.').replace(",", ".");
            return first + "," + list[1];
        }
        else
            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.').replace(",", ".");
    }
}

// Cách dùng: {{item.price | vsnumber : 2 }}