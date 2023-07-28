import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'trangthai'
})
export class TrangThaiPipe implements PipeTransform {
    transform(value: number, args?: any): any {
        switch (value) {
            case 1:
                return '<span class=\'vs-status vs-status-valid\'> Sử dụng </span>';
            default:
                return '<span class=\'vs-status vs-status-cancel\'> Không sử dụng </span>';
        }
    }
}
