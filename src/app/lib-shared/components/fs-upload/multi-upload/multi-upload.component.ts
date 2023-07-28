import {
    Component,
    OnInit,
    forwardRef,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { VsFsFileUploadService } from '../services/file-upload.service';
import { VsFsFileResponeType } from '../models/file-respone-type';
import { VsFsFileItem } from '../models/file-item';
import { ConfigurationService } from '../../../services/configuration.service';
import { UserService } from '../../../services/user.service';
import { FoldersService } from '../services/folders.service';
import { FilesService } from '../services/files.service';

@Component({
    selector: 'app-vs-multi-upload',
    templateUrl: './multi-upload.component.html',
    styleUrls: ['./multi-upload.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VsMultiUploadComponent),
            multi: true
        }
    ]
})
export class VsMultiUploadComponent implements OnInit, ControlValueAccessor {
    disabled = false;
    apiUrl = '';
    maxFileSize = 0;
    filesUploaded: VsFsFileItem[] = [];
    @Input() fileResponseType: VsFsFileResponeType = VsFsFileResponeType.object;
    @Input() chooseLabel = 'Chọn nhiều file';
    @Input() auto = true;

    @Output() onUploaded: EventEmitter<any> = new EventEmitter<any>();

    fileItem: VsFsFileItem;
    userId: number;
    folderId: number;
    createdByUser: string;
    progressValue: number;

    filesId = '';

    constructor(
        private _fileUploadService: VsFsFileUploadService,
        private _userService: UserService,
        private _FoldersService: FoldersService,
        private _FilesService: FilesService,
        private _configurationService: ConfigurationService
    ) {
        this.userId = this._userService.getBasicUserInfo().userId;
        this.createdByUser = this._userService.getBasicUserInfo().userName;
        this._FoldersService.GetRootFolder().then(rs => {
            if (rs.status) {
                this.folderId = rs.data.id;
                this.apiUrl = this._fileUploadService.linkUpload(this.folderId);
            }
        }).catch(err => {
            console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
        });

        this.maxFileSize = this._configurationService.maxFileSize;
    }

    ngOnInit() { }

    onChangeControl = (obj: any) => { };
    onTouched = () => { };

    writeValue(obj: any): void {
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
                this.onUploaded.next(this.filesId);
                this.onChangeControl(this.filesId);
            }
        } catch (e) {
            console.error(e);
        }

        console.log('after file uploaded:');
        console.log(this.filesUploaded);
    }

    onError(ev) { }

    onFileUploadRemoved(item: any) {
    }
    onProgress(event) {
        if (event.originalEvent.loaded !== 0) {
            this.progressValue = (event.originalEvent.loaded / event.originalEvent.total) * 100;
        }
    }
}
