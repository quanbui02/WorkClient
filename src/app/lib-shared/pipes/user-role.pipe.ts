import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tnUserRole'
})
export class VsUserRolePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            if (!value.hrCanBo && !value.sinhvien.id) {
                if (value.issuperuser && value.issuperuser) {
                    return 'Super user';
                } else {
                    if (value.hrcanbo.id > 0) {
                        return 'Cán bộ';
                    } else if (value.sinhvien.id > 0) {
                        return "Học viên";
                    } else {
                        return 'Người dùng';
                    }
                }
            }
        }

        return 'Người dùng';
    }
}
