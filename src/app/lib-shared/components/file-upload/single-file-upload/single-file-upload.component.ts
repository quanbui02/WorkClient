import {
    Component,
    OnInit,
    forwardRef,
    Input,
    EventEmitter,
    Output,
    ViewChild
} from '@angular/core';
import { ModuleConfigService } from '../../../services/module-config.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { VsFileUploadService } from '../services/file-upload.service';
import { NotifierService } from 'angular-notifier';
import { FileUpload } from 'primeng/primeng';
import { VsFileResponeType } from '../models/file-respone-type';
import { VsFileItem } from '../models/file-item';
import { VsAuthenService } from '../../../auth/authen.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'vs-single-file-upload',
    templateUrl: './single-file-upload.component.html',
    styleUrls: ['./single-file-upload.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VsSingleFileUploadComponent),
            multi: true
        }
    ]
})
export class VsSingleFileUploadComponent
    implements OnInit, ControlValueAccessor {
    disabled = false;
    fileUploaded: VsFileItem;
    rawFileName = '';
    apiUrl = '';
    uploading = false;
    maxFileSize = 0;
    isNullValued = true;
    userId = 0;
    createdByUser = '';
    @ViewChild(FileUpload) fileControl: FileUpload;

    @Input() chooseLabel = 'Chọn file';
    @Input() fileResponseType: VsFileResponeType = VsFileResponeType.string;
    @Input() showIconOnly = false;
    @Input() icon = 'fa fa-upload';
    @Output() onUploaded: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRemoved: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private _moduleConfigService: ModuleConfigService,
        private _fileUploadService: VsFileUploadService,
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
            if (this.fileResponseType === VsFileResponeType.string) {
                this.fileUploaded = <VsFileItem>{};
                this.fileUploaded.fileName = obj;
                this.isNullValued = false;
            } else {
                if (obj.fileName === '') {
                    this.isNullValued = true;
                    this.fileUploaded = <VsFileItem>{};
                } else {
                    this.fileUploaded = obj;
                    this.isNullValued = false;
                }
            }
            this.rawFileName = this._fileUploadService.getRawFileName(
                this.fileUploaded.fileName
            );
        } else {
            this.isNullValued = true;
            this.fileUploaded = <VsFileItem>{};
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
                this.rawFileName = files[0].name;
                const responseJson = JSON.parse(event.xhr.responseText);
                if (responseJson.success && responseJson.data[0].status) {
                    this.fileUploaded = responseJson.data[0];
                    if (this.fileResponseType === VsFileResponeType.string) {
                        this.onChangeControl(this.fileUploaded.fileName);
                        this.onUploaded.next(this.fileUploaded.fileName);
                    } else {
                        this.fileUploaded.createdDate = new Date();
                        if (sessionStorage['access_token']) {
                            this.fileUploaded.createdByUser = this.createdByUser;
                        }
                        this.onChangeControl(this.fileUploaded);
                        this.onUploaded.next(this.fileUploaded);
                    }
                    this.isNullValued = false;
                }
            }
        } catch (e) {
            console.error(e);
        }
        this.uploading = false;
    }

    downLoadFile() {
        let urld = '';
        if (this.fileResponseType === VsFileResponeType.string) {
            urld = this._fileUploadService.getLinkDownload(this.fileUploaded);
        }
        urld = this._fileUploadService.getLinkDownload(
            this.fileUploaded.fileName
        );
        top.location.href = urld;
    }

    deleteFile() {
        if (confirm('Bạn có chắc chắn muốn xóa?')) {
            if (this.fileResponseType === VsFileResponeType.string) {
                this._fileUploadService.deleteFile(this.fileUploaded);
                this.onRemoved.next(this.fileUploaded.fileName);
                this.onChangeControl(this.fileUploaded.fileName);
            } else {
                this._fileUploadService.deleteFile(this.fileUploaded.fileName);
                this.onRemoved.next(this.fileUploaded);
                this.onChangeControl(this.fileUploaded);
            }
            this.isNullValued = true;
        }

        this.fileUploaded = new VsFileItem();
    }

    onBeforeSend(ev) {
        console.log(ev);
    }

    onError(ev) {
        console.log(ev);
        this.uploading = false;
    }

    onSelect(ev) {
        console.log(ev);
    }

    selectFileUpload() {
        this.fileControl.basicFileInput.nativeElement.click();
    }

    onBeforeUpload() {
        this.uploading = true;
    }
}
