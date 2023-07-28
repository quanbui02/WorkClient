import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VsAuthenService } from '../../../auth/authen.service';
import { VsFsFileItem } from '../models/file-item';
import { VsFsFileUploadService } from '../services/file-upload.service';
import { UserService } from '../../../services/user.service';
import { FoldersService } from '../services/folders.service';
import { FilesService } from '../services/files.service';


@Component({
    selector: 'app-vs-select-file-onserver',
    templateUrl: './select-file-onserver.component.html',
    styleUrls: ['./select-file-onserver.component.scss']
})
export class TNSelectFileOnServerComponent implements OnInit {
    fsFolderParentId: number;
    fsFolderId: number;
    userId: number;
    createdByUser: string;
    files = [];
    folderLoading = true;
    mainForm: FormGroup;
    folderName: string;
    modalReference: any;

    constructor(
        private ngbModal: NgbModal,
        private _tn: VsAuthenService,
        private _builder: FormBuilder,
        private _userService: UserService,
        private _FoldersService: FoldersService,
        private _FilesService: FilesService,
        private _fileUploadService: VsFsFileUploadService,
    ) {
        this.mainForm = _builder.group({
            txtFolderName: new FormControl('', Validators.compose([Validators.required])),
        });
    }

    ngOnInit() {
        this.userId = this._userService.getBasicUserInfo().userId;
        this.createdByUser = this._userService.getBasicUserInfo().userName;
        this._FoldersService.GetRootFolder().then(rs => {
            if (rs.status) {
                this.fsFolderId = rs.data.id;
                this.onChangeFolder(null);
            }
        }).catch(err => {
            console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
        });
    }
    onChangeFolder(ev) {
        this.folderLoading = true;
        this.files = [];
        // Get Parent folder
        this._fileUploadService.foGetByFolderId(this.userId, this.fsFolderId).then(rs => {
            if (rs.status) {
                this.fsFolderParentId = rs.data.parentId;
                if (this.fsFolderParentId !== 0) {
                    let foItem: VsFsFileItem;
                    foItem = new VsFsFileItem();
                    foItem.id = rs.data.parentId;
                    foItem.fileName = '...';
                    foItem.rawFileName = '...';
                    foItem.typeId = 2;
                    this.files.push(foItem);
                }
            }
            // Get Folder
            this._fileUploadService.fogetChildFolder(this.userId, this.fsFolderId).then(rs => {
                if (rs.status) {
                    for (let i = 0; i < rs.data.length; i++) {
                        let fileItem: VsFsFileItem;
                        fileItem = new VsFsFileItem();
                        fileItem.id = rs.data[i].id;
                        fileItem.fileName = rs.data[i].name;
                        fileItem.createdDate = rs.data[i].createdDate;
                        fileItem.rawFileName = rs.data[i].name;
                        fileItem.typeId = 2;
                        this.files.push(fileItem);
                    }
                }

                // Get Files
                this._fileUploadService.fiGetsInFolder(this.userId, this.fsFolderId).then(rs => {
                    this.folderLoading = false;
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
                            this.files.push(fileItem);
                        }
                    }
                }).catch(err => {
                    console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
                });
            });
        });
    }

    onFolderClick(item) {
        // alert(item.id);
        this.fsFolderId = parseInt(item.id);
        this.onChangeFolder(item);

    }

    onReturn() {

    }
}
