import { Component, OnInit, Input, EventEmitter, Output, forwardRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { VsFsFileItem } from '../models/file-item';
import { VsFsFileUploadService, FileViewerType } from '../services/file-upload.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgbModalRef, NgbModal } from '../../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { FileViewerComponent } from '../file-viewer/file-viewer.component';
import { UserService } from '../../../services/user.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'vs-fs-list-file',
    templateUrl: './list-file.component.html',
    styleUrls: ['./list-file.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VsFsListFileComponent),
            multi: true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class VsFsListFileComponent implements OnInit, ControlValueAccessor {
    files: VsFsFileItem[] = [];
    disabled = false;
    ids = [];
    userId: number;
    linkView = '';
    selectedFile: VsFsFileItem = new VsFsFileItem();
    modalReference: NgbModalRef;
    @ViewChild('fileViewer') fileViewer: NgbModal;

    @Input() currentIds = '';
    @Input() isMngFile = false;
    @Input() viewOnly = false;
    @Input() isSingleFile = false;
    @Output() onUploaded: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRemoved: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSelectItem: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(FileViewerComponent) _FileViewerComponent: FileViewerComponent;

    constructor(
        private _fileService: VsFsFileUploadService,
        private ngbModal: NgbModal,
        private _userService: UserService,
    ) {

    }

    ngOnInit() {
        this.userId = this._userService.getBasicUserInfo().userId;
    }

    onChangeControl = (obj: any) => { };
    onTouched = () => { };

    writeValue(obj: VsFsFileItem[]): void {
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

    downloadFile(item) {
        window.open(this._fileService.getLinkDownload(item.id));
    }

    openFile(item: VsFsFileItem) {

    }
    deleteFile(item: VsFsFileItem) {
        if (item.typeId === 2) {
            this._fileService.deleteFolder(this.userId, item.id);
            const fileToRemove = this.files.findIndex(x => x.fileName === item.fileName);
            this.files.splice(fileToRemove, 1);
        } else {
            this._fileService.deleteFile(item);
            const fileToRemove = this.files.findIndex(x => x.fileName === item.fileName);
            this.files.splice(fileToRemove, 1);
            this.onChangeControl(this.files);
            this.onRemoved.next(item);
        }
    }

    deleteFileTemp(item: VsFsFileItem) {
        if (item.typeId === 2) {
            const fileToRemove = this.files.findIndex(x => x.fileName === item.fileName);
            this.files.splice(fileToRemove, 1);
        } else {
            const fileToRemove = this.files.findIndex(x => x.fileName === item.fileName);
            this.files.splice(fileToRemove, 1);
            this.onChangeControl(this.files);
            this.onRemoved.next(item);
        }
    }

    viewFile(item: VsFsFileItem) {
        window.open(this._fileService.getLinkView(item.id), '_blank');

    }

    async onItemClick(item: VsFsFileItem) {
        this.selectedFile = new VsFsFileItem();
        if (item.typeId === 2) {
            this.onChangeControl(this.files);
            this.onClick.next(item);
        } else {
            const fileViewerType = await this._fileService.getFileViewerType(item.fileExt);
            if (fileViewerType == FileViewerType.OfficeFile || fileViewerType == FileViewerType.Image) {
                console.log(item);
                this.selectedFile = item;
                this.linkView = await this._fileService.getLinkDownload(item.id);
                this._FileViewerComponent.showPopup(this.selectedFile.rawFileName, this.linkView);
                // this.modalReference = this.ngbModal.open(this.fileViewer, {
                //     keyboard: false,
                //     size: 'lg',
                //     windowClass: 'document-viewer'
                // });
            } else {
                window.open(this._fileService.getLinkDownload(item.id));
            }
        }
    }

    checkItem(item) {
        if (this.isSingleFile) {
            this.files.forEach(element => {
                if (element.id !== item.id) {
                    element.checked = false;
                }
            });
            if (item.checked) {
                this.ids = [];
                this.ids.push(item.id);
                item.checked = true;
            } else {
                this.ids.splice(this.ids.indexOf(item.id), 1);
                item.checked = false;
            }
            this.onChangeControl(this.ids);
            this.onSelectItem.next(this.ids + '');
        } else {
            this.ids = this.currentIds.split(',').filter(s => s !== '');
            if (item.checked) {
                // Kiểm tra nếu Id chưa có trong currentIds thì bổ sung
                if (this.currentIds.indexOf(item.id + ',') < 0 && this.currentIds.indexOf(',' + item.id) < 0) {
                    this.ids.push(item.id);
                    item.checked = true;
                    this.onSelectItem.next(this.ids + ',');
                }
            } else {
                // Kiểm tra nếu Id có trong currentIds thì remove để xóa
                this.currentIds = this.currentIds.replace(item.id + ',', '');
                this.currentIds = this.currentIds.replace(',' + item.id, '');
                this.ids.splice(this.ids.indexOf(item.id), 1);
                item.checked = false;
                this.onSelectItem.next(this.currentIds);
            }
            this.onChangeControl(this.ids);
        }


        // alert(this.ids + this.currentIds);
    }

    onClose() {
        this.modalReference.close();
    }
}
