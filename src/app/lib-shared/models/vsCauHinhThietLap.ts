import { IVsBaseModel, VsBaseModel } from './base.model';

export class VsCauHinhThietLap<T> extends VsBaseModel {
    id = 0;
    phanHe = '';
    module = '';
    thietLap = '';
    thietLapObj = <T>{};
    maCauHinh = '';
    constructor() {
        super();
    }
}
