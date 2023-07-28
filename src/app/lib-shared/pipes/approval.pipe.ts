import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'approval'
})
export class ApprovalPipe implements PipeTransform {

  transform(value: boolean, args?: any): any {
    if (value) {
      return '<i class=\'fa fa-check text-success\' aria-hidden=\'true\'></i>';
    }
  }

}
