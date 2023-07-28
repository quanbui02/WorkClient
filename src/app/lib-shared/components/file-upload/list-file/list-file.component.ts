import { Component, OnInit, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { VsFileItem } from '../models/file-item';
import { VsFileUploadService } from '../services/file-upload.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'vs-list-file',
    templateUrl: './list-file.component.html',
    styleUrls: ['./list-file.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VsListFileComponent),
            multi: true
        }
    ]
})
export class VsListFileComponent implements OnInit, ControlValueAccessor {
    files: VsFileItem[] = [];
    disabled = false;
    @Output() onUploaded: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRemoved: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _fileService: VsFileUploadService) {

    }

    ngOnInit() {

    }

    onChangeControl = (obj: any) => { };
    onTouched = () => { };

    writeValue(obj: VsFileItem[]): void {
        if (obj) {
            this.files = obj;
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

    downloadFile(fileName) {
        window.open(this._fileService.getLinkDownload(fileName));
    }

    openFile(item: VsFileItem) {

    }

    canBeOpenOnline(): boolean {
        return false;
    }

    deleteFile(item: VsFileItem) {
        if (confirm('Bạn có chắc chắn muốn xóa?')) {
            this._fileService.deleteFile(item);
            const fileToRemove = this.files.findIndex(x => x.fileName === item.fileName);
            this.files.splice(fileToRemove, 1);
            this.onChangeControl(this.files);
            this.onRemoved.next(item);

        }
    }
}
