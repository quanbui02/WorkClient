import { VsMySetting } from '../models/ccmysetting';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VsMySettingService {

    getCurrentSetting(): VsMySetting {
        let crrSetting = new VsMySetting();
        if (localStorage.getItem('mySetting')) {
            crrSetting = JSON.parse(localStorage.getItem('mySetting'));
        } else {
            crrSetting = new VsMySetting();
            // crrSetting.idHe = 1;
            // crrSetting.idHocKy = 1;
            // crrSetting.idNamHoc = (new Date()).getFullYear();
            // crrSetting.tenNamHoc = (new Date()).getFullYear().toString() + '-' + ((new Date()).getFullYear() + 1).toString();
            // crrSetting.trangThaiKetThucNamHoc = false;
            localStorage.setItem('mySetting', JSON.stringify(crrSetting));
        }
        return crrSetting;
    }

    setCurrentSetting(setting: VsMySetting) {
        localStorage.setItem('mySetting', JSON.stringify(setting));
    }
}
