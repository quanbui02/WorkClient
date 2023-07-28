import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModuleConfigService } from '../../../services/module-config.service';
import { VsFsFileUploadService } from '../services/file-upload.service';
import { NotifierService } from 'angular-notifier';
import { VsAuthenService } from '../../../auth/authen.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { TNThietLapCauHinhService } from '../../../services/cau-hinh-thiet-lap.service';
import { VsFsFileItem } from '../models/file-item';
import { FoldersService } from '../services/folders.service';
import { FilesService } from '../services/files.service';

@Component({
    selector: 'file-manager-popup',
    templateUrl: './file-manager-popup.component.html',
    styleUrls: ['./file-manager-popup.component.css']
})
export class FileManagerPopupComponent implements OnInit {
    filesUploaded: VsFsFileItem = new VsFsFileItem();
    modalReference: any;
    folderChanged = new EventEmitter<any>();
    fsFolderId = 0;
    userId = 0;
    folderName = '';
    apiUrl = '';
    files = [];
    createdByUser: string;
    fsFolderParentId = 0;
    isUploading = false;
    progressValue = 0;
    maxFileSize = 0;
    dinhDangFile = '';
    uploadedFiles: any[] = [];
    fileIds = '';
    folderCreating: boolean = false;
    isNullValued = true;
    @Input() isSingleFile = true;
    @Input() chooseLabel = 'Chọn file';
    @Input() auto = true;
    @Input() isMngFile = true;

    @Output() onItemSelected = new EventEmitter<any>();

    constructor(
        private _moduleConfigService: ModuleConfigService,
        private _fileUploadService: VsFsFileUploadService,
        private _notifierService: NotifierService,
        private _FoldersService: FoldersService,
        private _FilesService: FilesService,
        private _authenService: VsAuthenService,
        private ngbModal: NgbModal,
        private _builder: FormBuilder,
        private tNThietLapCauHinhService: TNThietLapCauHinhService
    ) { }

    ngOnInit() {

    }

    onClose() {

        this.modalReference.close();
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

    onError(ev) { }

    onChangeFolder(ev) {
        this.files = [];
        this.apiUrl = this._fileUploadService.linkUpload(this.fsFolderId);
        // Get Parent folder
        this._fileUploadService.foGetByFolderId(this.userId, this.fsFolderId).then(rs => {
            if (rs.status) {
                if (rs.data) {
                    this.folderChanged.next({ idPath: rs.data.idPath, displayPath: rs.data.displayPath });
                }

                if (this.fsFolderParentId !== 0) {
                    let foItem: VsFsFileItem;
                    foItem = new VsFsFileItem();
                    foItem.id = rs.data.parentId;
                    foItem.fileName = '...';
                    foItem.rawFileName = '...';
                    foItem.typeId = 2;
                    foItem.isvirtual = true;
                    this.files.push(foItem);
                    this.fsFolderParentId = rs.data.parentId;
                }
            }
            // Get Folder
            this._fileUploadService.fogetChildFolder(this.userId, this.fsFolderId).then(rx => {
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
                this._fileUploadService.fiGetsInFolder(this.userId, this.fsFolderId).then(rt => {
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
                            fileItem.path = rt.data[i].path;
                            fileItem.typeId = 1;
                            this.files.push(fileItem);
                        }
                    }
                }).catch(err => {
                    console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
                });
            });
        });
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

    onUploadEvent(event: any) {
        try {
            const files = event.files;
            if (files.length > 0) {
                const responseJson = JSON.parse(event.xhr.responseText);
                if (responseJson.status) {

                    this.onChangeFolder(0);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    onFolderClick(item) {
        // tslint:disable-next-line:radix
        this.fsFolderId = parseInt(item.id);
        this.onChangeFolder(item);
    }

    onSelectItem(ev) {
        this.fileIds = '';
        // this.onChangeControl(ev);
        // this.onItemSelected.next(ev);
        // this.writeValue(ev);
        this.fileIds = ev;

    }

    createFolder() {
        this.folderCreating = true;
    }

    onCreateFolder() {
        if (this.folderName == '')
            return;
        this._fileUploadService.CreateFolder(this.fsFolderId, this.folderName).then(rs => {
            this.folderCreating = false;
            this.folderName = '';
            this.onChangeFolder(false);
        });
    }

    onSelected() {
        this.onChangeControl(this.fileIds);
        this.onItemSelected.next(this.fileIds);
        this.writeValue(this.fileIds);
        this.modalReference.close();
    }

    writeValue(obj: any): void {
        this.filesUploaded = new VsFsFileItem();
        if (obj !== '' && obj != null) {
            this._fileUploadService.GetsByIds(obj).then(rs => {
                if (rs.status) {
                    this.filesUploaded.id = rs.data[0].id;
                    this.filesUploaded.fileName = rs.data[0].fileName;
                    this.filesUploaded.fileExt = rs.data[0].fileExt;
                    this.filesUploaded.createdByUser = rs.data[0].createdByUser;
                    this.filesUploaded.createdDate = rs.data[0].createdDate;
                    this.filesUploaded.rawFileName = this._fileUploadService.getRawFileName(
                        this.filesUploaded.fileName
                    );
                    this.filesUploaded.path = rs.data[0].path;
                    this.filesUploaded.typeId = 1;
                    this.filesUploaded.size = rs.data[0].size;
                    this.isNullValued = false;
                }
            }).catch(err => {
                // console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
                this.isNullValued = true;
            });
        } else {
            this.isNullValued = true;
        }
    }

    onChangeControl = (obj: any) => { };
    onTouched = () => { };
}
