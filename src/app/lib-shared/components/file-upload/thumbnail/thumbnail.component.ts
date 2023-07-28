import {
    Component,
    OnInit,
    forwardRef,
    EventEmitter,
    Output,
    Input,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { VsFileUploadService } from '../services/file-upload.service';
import { ModuleConfigService } from '../../../services/module-config.service';
import { FileUpload } from 'primeng/primeng';
import { ComponentBase } from '../../../classes/base/component-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'vs-thumbnail',
    templateUrl: './thumbnail.component.html',
    styleUrls: ['./thumbnail.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VsThumbnailComponent),
            multi: true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class VsThumbnailComponent extends ComponentBase implements OnInit, ControlValueAccessor {
    @Input() chooseLabel = 'Chọn ảnh';
    @Input() defaultNoImageUrl = 'assets/images/avatar.jpg';
    @Output() onUploaded: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRemoved: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(FileUpload) fileControl: FileUpload;
    disabled = false;
    fileUploaded = '';
    // rawFileName = '';
    apiUrl = '';
    uploading = false;
    hasFile = false;

    constructor(
        private _moduleConfigService: ModuleConfigService,
        private _fileUploadService: VsFileUploadService
    ) {
        super();
        this.apiUrl = _moduleConfigService.getConfig().Services.FileEndpoint + '/files';
    }

    ngOnInit() { }

    onChangeControl = (obj: string) => { };
    onTouched = () => { };

    writeValue(obj: any): void {
        this.hasFile = obj ? true : false;
        if (obj) {
            this.fileUploaded = obj;
            // this.rawFileName = this.getRawFileName(this.fileUploaded);
        } else {
            this.fileUploaded = this.defaultNoImageUrl;
        }
    }

    // getRawFileName(fileName: string): string {
    //     if (fileName.indexOf('_') > -1) {
    //         return fileName.substr(fileName.indexOf('_') + 1);
    //     }
    //     return fileName;
    // }

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
                // this.rawFileName = files[0].name;
                const responseJson = event.originalEvent;
                if (responseJson.body) {
                    if (responseJson.body.status) {
                        this.hasFile = true;
                        this.fileUploaded = responseJson.body.data[0].id;
                        this.onUploaded.next(this.fileUploaded);
                        this.onChangeControl(this.fileUploaded);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
        this.uploading = false;
    }

    deleteFile() {
        if (confirm('Bạn có chắc chắn muốn xóa?')) {
            this._fileUploadService.deleteFile(this.fileUploaded);
            this.onRemoved.next(this.fileUploaded);

            this.hasFile = false;
            this.fileUploaded = '';
            this.onChangeControl(this.fileUploaded);
        }
    }

    onBeforeUpload() {
        this.uploading = true;
    }

    onError(ev) {
        ev.srcElement.src = this.defaultNoImageUrl;
    }

    onSelectThumbnailClick() {
        this.fileControl.basicFileInput.nativeElement.click();
    }
}
