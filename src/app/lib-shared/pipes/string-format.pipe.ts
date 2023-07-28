import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringFormat'
})
export class StringFormatPipe implements PipeTransform {

    transform(value: string, args0?: any, args1?: any, args2?: any, args3?: any, args4?: any, args5?: any,
        args6?: any, args7?: any, args8?: any, args9?: any): string {

        const args = [];
        if (args0 || args0 === 0) {
            args.push(args0);
        }
        if (args1 || args1 === 0) {
            args.push(args1);
        }
        if (args2 || args2 === 0) {
            args.push(args2);
        }
        if (args3 || args3 === 0) {
            args.push(args3);
        }
        if (args4 || args4 === 0) {
            args.push(args4);
        }
        if (args5 || args5 === 0) {
            args.push(args5);
        }
        if (args6 || args6 === 0) {
            args.push(args6);
        }
        if (args7 || args7 === 0) {
            args.push(args7);
        }
        if (args8 || args8 === 0) {
            args.push(args8);
        }
        if (args9 || args9 === 0) {
            args.push(args9);
        }

        const length = args.length;
        for (let i = 0; i < length; i++) {
            value = value.replace(`{${i}}`, args[i]);
        }

        return value;
    }

}
