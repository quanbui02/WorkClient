import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ListHelperService {

    constructor() {

    }

    getLimitByScreen(): number {
        const windowHeight = window.innerHeight;

        if (windowHeight > 707) {
            return 15;
        }

        if (windowHeight > 1920) {
            return 50;
        }

        return 10;
    }
}
