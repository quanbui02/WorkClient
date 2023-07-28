import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'psDate'
})
export class VsDatePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return null;
    }

}

@Pipe({
    name: 'psDateTime'
})
export class VsDateTimePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return null;
    }

}
