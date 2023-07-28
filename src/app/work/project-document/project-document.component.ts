


import {
  Component,
  OnInit,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Message } from 'primeng/primeng';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VsSingleFsFileUploadComponent } from '../../lib-shared/components/fs-upload/single-file-upload/single-file-upload.component';
import { FoldersService } from '../../lib-shared/components/fs-upload/services/folders.service';
import { ComponentBase } from '../../lib-shared/classes/base/component-base';
import { VsFsFileItem } from '../../lib-shared/components/fs-upload/models/file-item';
import { FileViewerComponent } from '../../lib-shared/components/fs-upload/file-viewer/file-viewer.component';
import { VsFsFileResponeType } from '../../lib-shared/components/fs-upload/models/file-respone-type';
import { ModuleConfigService } from '../../lib-shared/services/module-config.service';
import { VsFsFileUploadService } from '../../lib-shared/components/fs-upload/services/file-upload.service';
import { FilesService } from '../../lib-shared/components/fs-upload/services/files.service';
import { UserService } from '../../lib-shared/services/user.service';
import { TNThietLapCauHinhService } from '../../lib-shared/services/cau-hinh-thiet-lap.service';

@Component({
  selector: 'app-project-document',
  templateUrl: './project-document.component.html',
  styleUrls: ['./project-document.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VsSingleFsFileUploadComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProjectDocumentComponent extends ComponentBase implements OnInit {
  id: number;
  disabled = false;
  apiUrl = '';
  maxFileSize = 1000000;
  dinhDangFile = 'image/*';
  currentIds = '';

  filesUploaded: VsFsFileItem = new VsFsFileItem();
  folder: any;
  folderCreating: boolean = false;
  showFileDialog = false;
  @ViewChild(FileViewerComponent) _FileViewerComponent: FileViewerComponent;

  @Input() fileResponseType: VsFsFileResponeType = VsFsFileResponeType.object;
  @Input() chooseLabel = 'Tải lên';
  @Input() auto = true;
  @Input() viewOnly = false;
  @Output() onUploaded = new EventEmitter<any>();
  @Output() onRemoved = new EventEmitter<any>();
  @Output() onItemSelected = new EventEmitter<any>();
  @Input() isMngFile = true;
  @Output() onCloseForm = new EventEmitter<any>();
  @ViewChild('fileViewer') fileViewer: NgbModal;

  userId = 0;
  createdByUser: string;
  filesId = '';
  progressValue = 0;
  modalReference: any;
  ids = '';
  files = [];
  // fsFolderId = 0;
  folderChanged = new EventEmitter<any>();
  fsFolderParentId = 0;
  folderName = '';
  mainForm: FormGroup;
  isUploading = false;
  msgs: Message[];
  uploadedFiles: any[] = [];
  isNullValued = true;
  @Input() showIconOnly = false;
  fileIds = '';
  linkView = '';

  constructor(
    private _moduleConfigService: ModuleConfigService,
    private _fileUploadService: VsFsFileUploadService,
    // private _notifierService: NotifierService,
    private _FoldersService: FoldersService,
    private _FilesService: FilesService,
    private _userService: UserService,
    private ngbModal: NgbModal,
    private _builder: FormBuilder,
  ) {
    super();
    this.mainForm = _builder.group({
      txtFolderName: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  ngOnInit() {
    this.userId = this._userService.getBasicUserInfo().userId;
    this.createdByUser = this._userService.getBasicUserInfo().userName;
    this.GetRootFolder();
  }

  // loadFiles() {
  //     // if (this.maxFileSize <= 0) {
  //     //     this.tNThietLapCauHinhService.getCauHinh('HeThong_CauHinhChung').then(rs => {
  //     //         if (rs.status) {
  //     //             this.maxFileSize = rs.data.thietLapObj.dungLuongFile * 1000000;
  //     //             this.dinhDangFile = rs.data.thietLapObj.dinhDangFile;
  //     //         }
  //     //     });
  //     // }
  //     this._FoldersService.GetRootFolder().then(rs => {
  //         if (rs.status) {
  //             this.fsFolderId = rs.data.parentId === 0 ? rs.data.id : rs.data.parentId;
  //             this.onChangeFolder(this.fsFolderId);
  //             this.apiUrl = this._fileUploadService.linkUpload(this.folder.id);
  //         }
  //     }).catch(err => {
  //         console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
  //     });
  // }

  onChangeControl = (obj: any) => { };
  onTouched = () => { };
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
          this.filesUploaded.rawFileName = this._fileUploadService.getRawFileName(this.filesUploaded.fileName);
          this.filesUploaded.path = rs.data[0].path;
          this.filesUploaded.typeId = 1;
          this.filesUploaded.size = rs.data[0].size;
          this.isNullValued = false;
          this.filesUploaded.linkViewOnline = this.urlImageAvatar(this.filesUploaded.path, this.filesUploaded.fileName);//  this._fileUploadService.getLinkDownload(this.filesUploaded.id);
        }
      }).catch(err => {
        this.isNullValued = true;
      });
    } else {
      this.isNullValued = true;
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
        const responseJson = event.originalEvent;
        if (responseJson.body) {
          if (responseJson.body.status) {
            const filesResponse = responseJson.body.data;
            for (const file of filesResponse) {
              this.fileIds = file.id;
            }
            this.currentIds += this.fileIds + ',';
            this.onChangeFolder(this.folder.id);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  onError(ev) { }

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
    this.apiUrl = this._fileUploadService.linkUpload(folderId);
    // Get Parent folder
    this._FoldersService.getDetail(folderId).then(rs => {
      if (rs.status) {
        this.files = [];
        if (rs.data) {
          this.folder = rs.data;
          this.folderChanged.next({ idPath: rs.data.idPath, displayPath: rs.data.displayPath });

          if (this.fsFolderParentId !== 0) {
            // let foItem: VsFsFileItem;
            // foItem = new VsFsFileItem();
            // foItem.id = rs.data.parentId;
            // foItem.fileName = '...';
            // foItem.rawFileName = '...';
            // foItem.typeId = 2;
            // foItem.isvirtual = true;
            // this.files.push(foItem);
            // this.fsFolderParentId = rs.data.parentId;
          }
        }

      }
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
              fileItem.linkViewOnline = this.urlImageAvatar(fileItem.path, fileItem.fileName); // this._fileUploadService.getLinkDownload(fileItem.id);
              fileItem.typeId = 1;
              // const tmp = ',' + this.currentIds;
              // if (tmp.indexOf(',' + fileItem.id + ',') >= 0) {
              //     fileItem.checked = true;
              // }
              this.files.push(fileItem);
            }
          }
        }).catch(err => {
          console.log('Có lỗi xảy ra, vui lòng thử lại ' + err);
        });
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
    this.fileIds = ev;
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
  // onSelected() {
  //   this.onChangeControl(this.fileIds);
  //   this.onItemSelected.next(this.fileIds);
  //   this.writeValue(this.fileIds);
  //   // this.modalReference.close();
  //   this.showFileDialog = false;

  // }
  onItemClick(item: VsFsFileItem) {
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
    this._FileViewerComponent.showPopup(item.fileName, item.linkViewOnline);
  }

  downloadFile(item: VsFsFileItem) {
    window.open(this._fileUploadService.getLinkDownload(item.id));
  }

  deleteFile() {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.writeValue('');
      this.onChangeControl('');
      this.onItemSelected.next('');
    }
  }

  onSelectFolderFromBreadcrumb(selectedFolder: any) {
    if (selectedFolder.id == 0) {
      this.GetRootFolder();
    } else {
      // subfolder
      this.onChangeFolder(selectedFolder.id);
    }
  }

  createFolder() {
    this.folderCreating = true;
  }
}

