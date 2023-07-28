import {
    Component,
    OnInit,
    forwardRef,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { VsFileUploadService } from '../services/file-upload.service';
import { ModuleConfigService } from '../../../services/module-config.service';
import { VsFileResponeType } from '../models/file-respone-type';
import { VsFileItem } from '../models/file-item';
import { ConfigurationService } from '../../../services/configuration.service';
import { UserService } from '../../../services/user.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'vs-multi-file-upload',
    templateUrl: './multi-file-upload.component.html',
    styleUrls: ['./multi-file-upload.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VsMultiFileUploadComponent),
            multi: true
        }
    ]
})
export class VsMultiFileUploadComponent
    implements OnInit, ControlValueAccessor {
    disabled = false;
    apiUrl = '';
    maxFileSize = 0;
    filesUploaded: VsFileItem[] = [];
    userId = 0;
    createdByUser = '';
    @Input() fileResponseType: VsFileResponeType = VsFileResponeType.object;
    @Input() chooseLabel = 'Chọn nhiều file';
    @Input() auto = true;

    @Output() onUploaded = new EventEmitter<any>();
    @Output() onRemoved = new EventEmitter<any>();

    constructor(
        private _moduleConfigService: ModuleConfigService,
        private _fileUploadService: VsFileUploadService,
        private _notifierService: NotifierService,
        private _userService: UserService,
        private _configurationService: ConfigurationService
    ) {
        this.apiUrl = _moduleConfigService.getConfig().ApiFileUpload;
        this.maxFileSize = this._configurationService.maxFileSize;
    }

    ngOnInit() {
        this.userId = this._userService.getBasicUserInfo().userId;
        this.createdByUser = this._userService.getBasicUserInfo().userName;
    }

    onChangeControl = (obj: any) => { };
    onTouched = () => { };

    writeValue(obj: any): void {
        if (obj) {
            this.filesUploaded = obj;
        }
    }
    registerOnChange(fn: any): void {
        this.onChangeControl = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onUploadEvent(event: any) {
        try {
            const files = event.files;
            if (files.length > 0) {
                this.filesUploaded = [];
                const responseJson = JSON.parse(event.xhr.responseText);
                if (responseJson.success) {
                    const filesResponse = responseJson.data;
                    for (const file of filesResponse) {
                        if (file.status) {
                            file.createdDate = new Date();
                            if (sessionStorage['access_token']) {
                                file.createdByUser = this.createdByUser;
                            }
                            this.filesUploaded.push(file);
                        }
                    }

                    if (this.fileResponseType === VsFileResponeType.string) {
                        const strArr = this.filesUploaded.map(
                            item => item.fileName
                        );
                        this.onChangeControl(strArr);
                        this.onUploaded.next(strArr);
                    } else {
                        this.onChangeControl(this.filesUploaded);
                        this.onUploaded.next(this.filesUploaded);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    onError(ev) { }

    onFileUploadRemoved(item: any) {
        this.onChangeControl(this.filesUploaded);
        this.onRemoved.next(item);
    }
}
