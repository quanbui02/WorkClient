import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'booleanFormat'
})
export class BooleanFormatPipe implements PipeTransform {

    constructor(private _translateService: TranslateService, ) { }

    transform(value: boolean, format: string): string {

        let   html        = '';
        let   displayText = '';
        const useType     = 'USE';
        const displayType = 'DISPLAY';

        if (value) {
            return 'far fa-check-square';
        } else {
            return 'far fa-square';
        }

        if (value && format === useType) {
            displayText = this._translateService.instant('PIPE.BOOLEAN_FORMAT.USE');
            html        = `<span class='label bg-blue'>${displayText}</span>`;
        }

        if (!value && format === useType) {
            displayText = this._translateService.instant('PIPE.BOOLEAN_FORMAT.NOT_USE');
            html        = `<span class='label bg-yellow'>${displayText}</span>`;
        }

        if (value && format === displayType) {
            displayText = this._translateService.instant('PIPE.BOOLEAN_FORMAT.DISPLAY');
            html        = `<span class='label bg-blue'>${displayText}</span>`;
        }

        if (!value && format === displayType) {
            displayText = this._translateService.instant('PIPE.BOOLEAN_FORMAT.NOT_DISPLAY');
            html        = `<span class='label bg-yellow'>${displayText}</span>`;
        }

        return html;
    }

}
