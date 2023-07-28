import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
})
export class HeartBeatService {

    listFailedHeartBeat = [];

    constructor(private _http: HttpClient) { }

    sendHeartBeat() {
        for (const key in environment.apiDomain) {

            if (this.listFailedHeartBeat.findIndex(x => x === key) > -1) {
                continue;
            }

            // const infoUrl = `${environment.apiDomain[key]}/info`;
            // this._http.get(infoUrl).toPromise()
            //     .then(rs => {
            //         this.listFailedHeartBeat.splice(this.listFailedHeartBeat.findIndex(x => x === key), 1);
            //     })
            //     .catch(err => {
            //         this.listFailedHeartBeat.push(key);
            //     });
        }
    }
}
