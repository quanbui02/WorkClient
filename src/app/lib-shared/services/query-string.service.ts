import { Injectable } from '@angular/core';

@Injectable()
export class VsQueryStringService {
    fullUrl = '';
    query = [];

    constructor() {
        this.fullUrl = self.location.href;
        if (this.fullUrl.indexOf('?') > -1) {
            let q = this.fullUrl.split('?')[1];
            let temp = q.split('&');
            for (let itemTemp in temp) {
                let queryKeyValue = temp[itemTemp].split('=');
                this.query.push({
                    key: queryKeyValue[0].toLowerCase().trim(),
                    value: queryKeyValue[1]
                });
            }
        }
    }

    getQueryString(key: string): string {
        let rs = this.query.find(x => x.key == key.toLowerCase().trim());
        if (rs) return rs.value;
        return '';
    }

    getQueryStringBool(key: string, defaultValue?: boolean): boolean {
        let qs = this.getQueryString(key);
        if (qs && qs !== '') {
            return qs == 'true';
        } else {
            if (defaultValue) {
                return defaultValue;
            }
        }
        return null;
    }
}
