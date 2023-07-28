import { Pipe, PipeTransform } from '@angular/core';
import { VsQueryStringService } from '../services/query-string.service';
import { ModuleConfigService } from '../services/module-config.service';
import { VsModuleConfig } from '../models/module-config';

@Pipe({
    name: 'tnPrintOnDebug'
})
export class VsPrintOnDebugPipe implements PipeTransform {
    config: VsModuleConfig;

    public constructor(
        private _tnQueryStringService: VsQueryStringService,
        private _moduleConfigService: ModuleConfigService
    ) {
        this.config = _moduleConfigService.getConfig();
    }
    transform(value: any, args?: any): any {
        let isDebug = this._tnQueryStringService.getQueryStringBool(
            'isDebug',
            false
        );
        if (isDebug || this.config.IsDebugMode) {
            try {
                let obj = JSON.stringify(value);
                return obj;
            } catch (e) {
                return value;
            }
        }

        return '';
    }
}
