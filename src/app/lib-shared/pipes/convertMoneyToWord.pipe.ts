import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertMoneyToWord'
})
export class ConvertMoneyToWordPipe implements PipeTransform {

    transform(value: boolean, args?: any): any {
        if (value) {
            this.doc(value);
        }
    }

    doc(SoTien) {
        let lan = 0;

        let i = 0;

        let so = 0;

        let KetQua = '';

        let tmp = '';

        let soAm = false;

        const viTri = new Array();

        if (SoTien < 0) { soAm = true; }// return "Số tiền âm !";

        if (SoTien == 0) { return 'Không đồng'; }// "Không đồng !";

        if (SoTien > 0) {

            so = SoTien;

        } else {

            so = -SoTien;

        }

        if (SoTien > 8999999999999999) {

            // SoTien = 0;

            return '';// "Số quá lớn!";

        }

        viTri[5] = Math.floor(so / 1000000000000000);

        if (isNaN(viTri[5])) {

            viTri[5] = '0';
        }

        so = so - parseFloat(viTri[5].toString()) * 1000000000000000;

        viTri[4] = Math.floor(so / 1000000000000);

        if (isNaN(viTri[4])) {

            viTri[4] = '0';
        }

        so = so - parseFloat(viTri[4].toString()) * 1000000000000;

        viTri[3] = Math.floor(so / 1000000000);

        if (isNaN(viTri[3])) {

            viTri[3] = '0';
        }

        so = so - parseFloat(viTri[3].toString()) * 1000000000;

        viTri[2] = so / 1000000;

        if (isNaN(viTri[2])) {

            viTri[2] = '0';
        }

        viTri[1] = (so % 1000000) / 1000;

        if (isNaN(viTri[1])) {

            viTri[1] = '0';
        }

        viTri[0] = so % 1000;

        if (isNaN(viTri[0])) {

            viTri[0] = '0';
        }

        if (viTri[5] > 0) {

            lan = 5;

        } else if (viTri[4] > 0) {

            lan = 4;

        } else if (viTri[3] > 0) {

            lan = 3;

        } else if (viTri[2] > 0) {

            lan = 2;

        } else if (viTri[1] > 0) {

            lan = 1;

        } else {

            lan = 0;

        }

        for (i = lan; i >= 0; i--) {

            tmp = this.docSo3ChuSo(viTri[i]);

            KetQua += tmp;

            // if (viTri[i] > 0) { KetQua += tien[i]; }

            if ((i > 0) && (tmp.length > 0)) { KetQua += ''; }// ',';//&& (!string.IsNullOrEmpty(tmp))

        }

        if (KetQua.substring(KetQua.length - 1) == ',') {

            KetQua = KetQua.substring(0, KetQua.length - 1);

        }

        KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);

        if (soAm) {

            return 'Âm ' + KetQua + ' đồng';// .substring(0, 1);//.toUpperCase();// + KetQua.substring(1);

        } else {

            return KetQua + ' đồng';// .substring(0, 1);//.toUpperCase();// + KetQua.substring(1);

        }

    }


    docSo3ChuSo(baso) {
        const chuSo = [' không ', ' một ', ' hai ', ' ba ', ' bốn ', ' năm ', ' sáu ', ' bảy ', ' tám ', ' chín '];
        const Tien = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];

        let tram;

        let chuc;

        let donvi;

        let KetQua = '';

        tram = baso / 100;

        chuc = (baso % 100) / 10;

        donvi = baso % 10;

        if (tram == 0 && chuc == 0 && donvi == 0) { return ""; }

        if (tram != 0) {

            KetQua += chuSo[tram] + ' trăm ';

            if ((chuc == 0) && (donvi != 0)) { KetQua += " linh "; }

        }

        if ((chuc != 0) && (chuc != 1)) {

            KetQua += chuSo[chuc] + ' mươi';

            if ((chuc == 0) && (donvi != 0)) { KetQua = KetQua + " linh "; }

        }

        if (chuc == 1) { KetQua += " mười "; }

        switch (donvi) {

            case 1:

                if ((chuc != 0) && (chuc != 1)) {

                    KetQua += ' mốt ';

                } else {

                    KetQua += chuSo[donvi];

                }

                break;

            case 5:

                if (chuc == 0) {

                    KetQua += chuSo[donvi];

                } else {

                    KetQua += ' lăm ';

                }

                break;

            default:

                if (donvi != 0) {

                    KetQua += chuSo[donvi];

                }

                break;

        }

        return KetQua;

    }
}
