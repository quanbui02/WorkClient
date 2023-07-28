import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class GlobalService {

    private _state = true;
    private _userLoaded = new Subject<any>();
    private _userReadyPopulate = new Subject<any>();

    constructor() { }

    setSearchBoxState(state) {
        this._state = state;
    }

    getSearchBoxState() {
        return this._state;
    }

    userLoaded() {
        return this._userLoaded;
    }

    setUserLoaded(val: any) {
        this._userLoaded.next(val);
    }

    userReadyPopulate() {
        return this._userReadyPopulate;
    }

    setUserReadyPopulate(val: any) {
        this._userReadyPopulate.next(val);
    }
}
