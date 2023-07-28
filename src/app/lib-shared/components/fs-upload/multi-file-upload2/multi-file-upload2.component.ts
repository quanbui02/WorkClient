import {
    Component,
    OnInit,
    forwardRef,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation,
    Injector,
    ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { VsFsFileUploadService } from '../services/file-upload.service';
import { VsFsFileResponeType } from '../models/file-respone-type';
import { VsFsFileItem } from '../models/file-item';
import { Message } from 'primeng/primeng';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { FoldersService } from '../services/folders.service';
import { SecondPageEditBase } from '../../../classes/base/second-page-edit-base';
import { FilesService } from '../services/files.service';
import { FileViewerComponent } from '../file-viewer/file-viewer.component';

@Component({
    selector: 'app-multi-file-upload2',
    templateUrl: './multi-file-upload2.component.html',
    styleUrls: ['./multi-file-upload2.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VsMultiFileUpload2Component),
            multi: true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class VsMultiFileUpload2Component extends SecondPageEditBase implements OnInit, ControlValueAccessor {
    id: number;
    disabled = false;
    apiUrl = '';
    maxFileSize = 1000000;
    dinhDangFile = 'image/*';
    filesUploaded: VsFsFileItem[] = [];
    folder: any;
    folderCreating = false;
    folderChanged = new EventEmitter<any>();

    @Input() fileResponseType: VsFsFileResponeType = VsFsFileResponeType.object;
    @Input() chooseLabel = 'Chọn nhiều file';
    @Input() auto = true;
    @Input() viewOnly = false;
    @Input() isSingleFile = false;

    showFileDialog = false;

    @Input() viewUpload = true;
    @Output() onUploaded = new EventEmitter<any>();
    @Output() onRemoved = new EventEmitter<any>();
    @Output() onItemSelected = new EventEmitter<any>();

    fileItem: VsFsFileItem = new VsFsFileItem();
    userId = 0;
    createdByUser: string;
    progressValue = 0;
    modalReference: any;
    //ids = '';
    files = [];
    fsFolderParentId = 0;
    folderName = '';
    mainForm: FormGroup;
    isUploading = false;
    msgs: Message[];
    uploadedFiles: any[] = [];
    currentIds = '';
    fileIds = '';

    @ViewChild(FileViewerComponent) _FileViewerComponent: FileViewerComponent;

    constructor(
        protected _injector: Injector,
        //private _moduleConfigService: ModuleConfigService,
        private _fileUploadService: VsFsFileUploadService,
        private _FoldersService: FoldersService,
        private _FilesService: FilesService,
        private _userService: UserService,
        private ngbModal: NgbModal,
        private formBuilder: FormBuilder
    ) {
        super(null, _injector);
    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            txtFolderName: new FormControl('', Validators.compose([Validators.required]))
        });
        this.userId = this._userService.getBasicUserInfo().userId;
        this.createdByUser = this._userService.getBasicUserInfo().userName;
    }

    onChangeControl = (obj: any) => { };
    onTouched = () => { };

    writeValue(obj: any): void {
        this.filesUploaded = [];
        this.currentIds = '';
        if (obj !== '' && obj != null) {
            this.currentIds = obj;
            this._fileUploadService.GetsByIds(obj).then(rs => {
                if (rs.status) {
                    for (let i = 0; i < rs.data.length; i++) {
                        let fileItem: VsFsFileItem;
                        fileItem = new VsFsFileItem();
                        fileItem.id = rs.data[i].id;
                        fileItem.fileName = rs.data[i].fileName;
                        fileItem.fileExt = rs.data[i].fileExt;
                        fileItem.path = rs.data[i].path;
                        fileItem.createdByUser = rs.data[i].createdByUser;
                        fileItem.createdDate = rs.data[i].createdDate;
                        fileItem.rawFileName = this._fileUploadService.getRawFileName(fileItem.fileName);
                        fileItem.typeId = 1;
                        fileItem.size = rs.data[i].size;
                        fileItem.linkViewOnline = this.urlImageMedium(fileItem.path, fileItem.fileName); // this._fileUploadService.getLinkDownload(fileItem.id);
                        fileItem.linkZoom = this.urlImageOriginal(fileItem.path, fileItem.fileName);
                        // alert(rs.data[i].fileName);
                        this.filesUploaded.push(fileItem);
                    }

                }
            }).catch(err => {
                console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
            });
            // this.filesUploaded = obj;
            // console.log(this.filesUploaded);
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
            // console.log(event);
            if (files.length > 0) {
                this.fileIds = '';
                const responseJson = event.originalEvent;
                if (responseJson.body) {
                    if (responseJson.body.status) {
                        const filesResponse = responseJson.body.data;
                        for (const file of filesResponse) {
                            this.fileIds += file.id + ',';
                        }
                        this.currentIds += this.fileIds;
                        this.onChangeFolder(this.folder.id);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    onError(ev) { }

    onFileUploadRemoved(item: any) {
        this.fileIds = '';
        for (const file of this.filesUploaded) {
            this.fileIds += file.id + ',';
        }
        this.onRemoved.next(item);
        this.onChangeControl(this.fileIds);
    }
    onProgress(event) {
        if (event.originalEvent.loaded !== 0) {
            this.isUploading = true;
            this.progressValue = (event.originalEvent.loaded / event.originalEvent.total) * 100;
        }
        if (event.originalEvent.loaded === 100) {
            this.isUploading = false;
        }
    }

    // sg
    onChangeFolder(folderId: number) {
        // console.log(this.currentIds);
        this.files = [];
        this.apiUrl = this._fileUploadService.linkUpload(folderId);

        this._FoldersService.getDetail(folderId).then(rs => {
            if (rs.status) {
                this.folder = rs.data;
                this.folderChanged.next({ idPath: rs.data.idPath, displayPath: rs.data.displayPath });

                this.fsFolderParentId = rs.data.parentId;
                if (this.fsFolderParentId !== 0) {
                    // let foItem: VsFsFileItem;
                    // foItem = new VsFsFileItem();
                    // foItem.id = rs.data.parentId;
                    // foItem.fileName = '...';
                    // foItem.rawFileName = '...';
                    // foItem.typeId = 2;
                    // foItem.isvirtual = true;
                    // this.files.push(foItem);
                }
            }
        });

        // Get Folder
        this._FoldersService.GetByParentId(folderId).then(rx => {
            if (rx.status) {
                for (let i = 0; i < rx.data.length; i++) {
                    let fileItem: VsFsFileItem;
                    fileItem = new VsFsFileItem();
                    fileItem.id = rx.data[i].id;
                    fileItem.fileName = rx.data[i].name;
                    fileItem.createdDate = rx.data[i].createdDate;
                    fileItem.rawFileName = rx.data[i].name;
                    fileItem.idPath = rx.data[i].idPath;
                    fileItem.displayPath = rx.data[i].displayPath;
                    fileItem.typeId = 2;
                    this.files.push(fileItem);
                }
            }

            // Get Files
            this._FilesService.GetByFolderId(folderId).then(rt => {
                if (rt.status) {
                    for (let i = 0; i < rt.data.length; i++) {
                        let fileItem: VsFsFileItem;
                        fileItem = new VsFsFileItem();
                        fileItem.id = rt.data[i].id;
                        fileItem.fileName = rt.data[i].fileName;
                        fileItem.fileExt = rt.data[i].fileExt;
                        fileItem.createdByUser = rt.data[i].createdByUser;
                        fileItem.createdDate = rt.data[i].createdDate;
                        fileItem.size = rt.data[i].size;
                        fileItem.rawFileName = this._fileUploadService.getRawFileName(fileItem.fileName);
                        fileItem.path = rt.data[i].path;
                        fileItem.linkViewOnline = this.urlImageMedium(fileItem.path, fileItem.fileName); // this._fileUploadService.getLinkDownload(fileItem.id);
                        fileItem.typeId = 1;
                        const tmp = ',' + this.currentIds;
                        if (tmp.indexOf(',' + fileItem.id + ',') >= 0) {
                            fileItem.checked = true;
                        }
                        this.files.push(fileItem);
                    }
                }
            }).catch(err => {
                console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
            });
        });
    }

    GetRootFolder() {
        this._FoldersService.GetRootFolder().then(rs => {
            if (rs.status) {
                this.folder = rs.data;
                this.onChangeFolder(this.folder.id);
                this.apiUrl = this._fileUploadService.linkUpload(this.folder.id);
                this.showFileDialog = true;
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    onSelectItem(ev) {
        this.currentIds = ev;
    }
    onFolderClick(item) {
        this.onChangeFolder(item.id);
    }
    onCreateFolder() {
        const modelEdit = {
            name: this.folderName,
            parentId: this.folder.id,
            displayPath: this.folder.displayPath,
            idPath: this.folder.idPath
        };

        this._FoldersService.post(modelEdit).then(rs => {
            if (rs.status) {
                this.folderCreating = false;
                this.folderName = '';
                this.onChangeFolder(this.folder.id);
                this._notifierService.showSuccess('Cập nhật thành công');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }
    onClose() {
        // this.modalReference.close();
    }

    deleteFile(item: VsFsFileItem) {
        const fileToRemove = this.filesUploaded.findIndex(x => x.id === item.id);
        this.filesUploaded.splice(fileToRemove, 1);
        this.currentIds = '';
        for (const file of this.filesUploaded) {
            this.currentIds += file.id + ',';
        }
        this.onChangeControl(this.currentIds);
        this.onItemSelected.next(this.currentIds);
        this.writeValue(this.currentIds);
    }
    createFolder() {
        this.folderCreating = true;
    }

    onSelected() {
        this.onChangeControl(this.currentIds);
        this.onItemSelected.next(this.currentIds);
        this.writeValue(this.currentIds);
        // this.modalReference.close();
        this.showFileDialog = false;
    }

    onSelectFolderFromBreadcrumb(selectedFolder: any) {
        if (selectedFolder.id == 0) {
            this.GetRootFolder();
        } else {
            // subfolder
            this.onChangeFolder(selectedFolder.id);
        }
    }

    downloadFile(item) {
        window.open(this._fileUploadService.getLinkDownload(item.id));
    }

    downloadFileAll() {
        this.filesUploaded.forEach(element => {
            const url = this._fileUploadService.getLinkDownload(element.id);
            window.open(url);
        });
    }

    viewFile(item: VsFsFileItem) {
        // const fileViewerType = this._fileUploadService.getFileViewerType(item.fileExt);
        // if (fileViewerType === FileViewerType.OfficeFile || fileViewerType === FileViewerType.Image) {
        //     this.linkView = this._fileUploadService.getLinkDownload(item.id);
        //     this.modalReference = this.ngbModal.open(this.fileViewer, {
        //         keyboard: false,
        //         size: 'lg',
        //         windowClass: 'document-viewer'
        //     });
        // } else {
        //     window.open(this._fileUploadService.getLinkDownload(item.id));
        // }
        this._FileViewerComponent.showPopup(item.fileName, this.urlImageOriginal(item.path, item.fileName));
    }
}

