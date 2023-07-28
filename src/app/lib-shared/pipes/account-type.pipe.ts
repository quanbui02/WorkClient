import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountType'
})
export class AccountTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value != null) {
      if (value.toString().toLowerCase() == "g+") {
        return "<i class=\"fa fa-google-plus text-danger\" aria-hidden=\"true\"></i>";
      }
      else if (value.toString().toLowerCase() == "facebook") {
        return "<i class=\"fa fa-facebook-square text-blue\" aria-hidden=\"true\"></i>"
      }
    }

    return "Hệ thống";
  }

}
