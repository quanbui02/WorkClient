import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';

@Injectable()
export class VsConfirmBoxService {

    constructor() { }

    show(title: string, text: string): Observable<any> {
        let rs: EventEmitter<any> = new EventEmitter<any>();

        swal({
            title: title,
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có. Tôi chắc chắn!',
            cancelButtonText: 'Đóng'
        }).then((result) => {
            rs.emit(result);
        });

        return rs;
    }
}

