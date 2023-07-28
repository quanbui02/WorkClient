import {
    Component,
    OnInit,
    forwardRef,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { VsFsFileUploadService } from '../services/file-upload.service';
import { VsFsFileResponeType } from '../models/file-respone-type';
import { VsFsFileItem } from '../models/file-item';
import { Message } from 'primeng/primeng';
import { UserService } from '../../../services/user.service';
import { FoldersService } from '../services/folders.service';
import { FilesService } from '../services/files.service';

@Component({
    selector: 'app-multi-fsfile-upload',
    templateUrl: './multi-file-upload.component.html',
    styleUrls: ['./multi-file-upload.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VsFsMultiFileUploadComponent),
            multi: true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class VsFsMultiFileUploadComponent implements OnInit, ControlValueAccessor {
    id: number;
    disabled = false;
    apiUrl = '';
    maxFileSize = 1000000;
    dinhDangFile = 'image/*';
    filesUploaded: VsFsFileItem[] = [];
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
    ids = '';
    files = [];
    fsFolderId = 0;
    fsFolderParentId = 0;
    folderName = '';
    mainForm: FormGroup;
    isUploading = false;
    msgs: Message[];
    uploadedFiles: any[] = [];
    currentIds = '';
    fileIds = '';

    constructor(
        private _fileUploadService: VsFsFileUploadService,
        private _userService: UserService,
        private _FoldersService: FoldersService,
        private _FilesService: FilesService,
        private _builder: FormBuilder
    ) {
        this.mainForm = _builder.group({
            txtFolderName: new FormControl('', Validators.compose([Validators.required])),
        });
    }

    ngOnInit() {
        this.userId = this._userService.getBasicUserInfo().userId;
        this.createdByUser = this._userService.getBasicUserInfo().userName;
    }

    onChangeControl = (obj: any) => { };
    onTouched = () => { };

    writeValue(obj: any): void {
        this.filesUploaded = [];
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
                        fileItem.createdByUser = rs.data[i].createdByUser;
                        fileItem.createdDate = rs.data[i].createdDate;
                        fileItem.rawFileName = this._fileUploadService.getRawFileName(
                            fileItem.fileName
                        );
                        fileItem.path = rs.data[i].path;
                        fileItem.typeId = 1;
                        fileItem.size = rs.data[i].size;
                        fileItem.linkViewOnline = this._fileUploadService.getLinkDownload(fileItem.id);
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

                const responseJson = event.originalEvent;
                if (responseJson.body) {
                    if (responseJson.body.status) {
                        const filesResponse = responseJson.body.data;
                        for (const file of filesResponse) {
                            this.fileIds += file.id + ',';
                        }
                        this.currentIds += this.fileIds;
                        this.onChangeFolder(0);
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
    onChangeFolder(ev) {
        // console.log(this.currentIds);
        this.files = [];
        this.apiUrl = this._fileUploadService.linkUpload(this.fsFolderId);
        // Get Parent folder
        this._fileUploadService.foGetByFolderId(this.userId, this.fsFolderId).then(rs => {
            if (rs.status) {
                this.files = [];
                if (rs.data) {
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


                // Get Folder
                this._fileUploadService.fogetChildFolder(this.userId, rs.data.id).then(rx => {
                    if (rx.status) {
                        for (let i = 0; i < rx.data.length; i++) {
                            let fileItem: VsFsFileItem;
                            fileItem = new VsFsFileItem();
                            fileItem.id = rx.data[i].id;
                            fileItem.fileName = rx.data[i].name;
                            fileItem.createdDate = rx.data[i].createdDate;
                            fileItem.rawFileName = rx.data[i].name;
                            fileItem.typeId = 2;
                            this.files.push(fileItem);
                        }
                    }

                    // Get Files
                    this._fileUploadService.fiGetsInFolder(this.userId, rs.data.id).then(rt => {
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
                                fileItem.rawFileName = this._fileUploadService.getRawFileName(
                                    fileItem.fileName
                                );
                                fileItem.linkViewOnline = this._fileUploadService.getLinkDownload(fileItem.id);
                                fileItem.path = rt.data[i].path;
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
        });
    }

    openFileViewer() {

        this._FoldersService.GetRootFolder().then(rs => {
            if (rs.status) {
                this.fsFolderId = rs.data.parentId == 0 ? rs.data.id : rs.data.parentId;
                this.onChangeFolder(this.fsFolderId);
                this.apiUrl = this._fileUploadService.linkUpload(this.fsFolderId);
                this.showFileDialog = true;
                // this.modalReference = this.ngbModal.open(content, {
                //     // backdrop: "static",
                //     keyboard: false,
                //     size: 'lg',
                // });
            }
        }).catch(err => {
            console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
        });
    }

    onSelectItem(ev) {
        this.currentIds = ev;
    }
    onFolderClick(item) {
        // tslint:disable-next-line:radix
        this.fsFolderId = parseInt(item.id);
        this.onChangeFolder(item);
    }
    onCreateFolder() {
        this._fileUploadService.CreateFolder(this.fsFolderId, this.folderName).then(rs => {
            this.folderCreating = false;
            this.folderName = '';
            this.onChangeFolder(false);
        });
    }
    onClose() {
        // this.modalReference.close();
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
            // root folder
            this._FoldersService.GetRootFolder().then(rs => {
                if (rs.status) {
                    this.fsFolderId = rs.data.parentId;
                    this.onChangeFolder(this.fsFolderId);
                    this.apiUrl = this._fileUploadService.linkUpload(this.fsFolderId);
                }
            }).catch(err => {
                console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
            });

        } else {
            // subfolder
            this.fsFolderId = selectedFolder.id;
            this.onChangeFolder(this.fsFolderId);
        }
    }
}
