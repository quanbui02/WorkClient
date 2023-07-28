import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'summary'
})
export class SummaryPipe implements PipeTransform {

    transform(value: string, number: number, trimType: 'word' | 'character' = 'word'): string {
        if (value) {
            let op = '';
            if (trimType === 'word') {
                const arr = value.split(' ');
                let length = arr.length;

                if (length > number) {
                    length = number;
                }

                for (let i = 0; i < length; i++) {
                    op += arr[i] + ' ';
                }

                if (op !== '') {
                    op = op.trim();
                }

                if (value && arr.length > number) {
                    op += '...';
                }
            } else {
                const length = value.length;
                if (length > number) {
                    op = value.substring(0, number) + '...';
                } else {
                    op = value;
                }
            }

            return op;
        }
    }

}
