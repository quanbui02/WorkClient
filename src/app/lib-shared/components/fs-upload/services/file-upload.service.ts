import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VsFsFileItem } from '../models/file-item';
import { ConfigurationService } from '../../../services/configuration.service';
import { retry, catchError } from 'rxjs/operators';
import { VsAuthenService } from '../../../auth/authen.service';

export interface ResponseResult {
    status: boolean;
    message: string;
    error: string;
    data: any;
    totalRecord: number;
}

@Injectable()
export class VsFsFileUploadService {
    constructor(
        private http: HttpClient,
        private _configurationService: ConfigurationService,
        private injector: Injector
    ) {
    }

    getTreeView(userId: number): Promise<ResponseResult> {
        const url = `${this._configurationService.apiFsFolder}/getsallbyuserid?userId=${userId}`;
        return this.http
            .get<ResponseResult>(url)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    linkUpload(folderId: number) {
        return `${this._configurationService.apiFsFile}/Image?folderId=${folderId}`;
    }

    getLinkDownload(id: string) {
        return `${this._configurationService.apiFsFile}/image/Original/${id}`;
    }

    canBeOpenOnline(item: VsFsFileItem) {
        if (item.fileExt === '.doc' || item.fileExt === '.docx' || item.fileExt === '.pdf' || item.fileExt === '.xls'
            || item.fileExt === '.xlsx' || item.fileExt === '.ppt' || item.fileExt === '.pptx' || item.fileExt === '.rtf'
            || item.fileExt === '.txt' || item.fileExt === '.jpg' || item.fileExt === '.jpeg'
            || item.fileExt === '.png' || item.fileExt === '.gif'
        ) {
            return true;
        }
        return false;
    }

    getFileViewerType(fileExt: string): FileViewerType {
        let op: FileViewerType = FileViewerType.Other;

        let imageExts = /(gif|jpg|jpeg|tiff|png)$/i;
        let documentExts = /(doc|docm|docx|dot|dotm|dotx|epub|fodt|htm|html|mht|odt|ott|pdf|rtf|txt|djvu|xps|csv|fods|ods|ots|xls|xlsm|xlsx|xlt|xltm|xltx|fodp|odp|otp|pot|potm|potx|pps|ppsm|ppsx|ppt|pptm|pptx)$/i;

        if (fileExt.startsWith("."))
            fileExt = fileExt.substring(1);
        if (imageExts.test(fileExt))
            return FileViewerType.Image;
        if (documentExts.test(fileExt))
            return FileViewerType.OfficeFile;

        return op;
    }

    getLinkView(id) {
        return this._configurationService.googleViewOnline + this.getLinkDownload(id);
    }

    getRawFileName(fileName: string): string {
        if (fileName != null) {
            if (fileName.indexOf('_') > -1) {
                return fileName.substr(0, fileName.indexOf('_'));
            }
            return fileName;
        }
        return '';
    }

    // GetAppRootFolder(): Promise<ResponseResult> {
    //     // tslint:disable-next-line:max-line-length
    //     const url = `${this._configurationService.apiFsFolder}/GetAppRootFolder`;
    //     return this.http
    //         .get<ResponseResult>(url)
    //         .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    // }

    foGetByFolderId(userId: number, folderId: number): Promise<ResponseResult> {
        // tslint:disable-next-line:max-line-length
        const url = `${this._configurationService.apiFsFolder}/getbyfolderid?app=${this._configurationService.fsAppFolder}&userId=${userId}&folderId=${folderId}`;
        return this.http
            .get<ResponseResult>(url)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    fogetChildFolder(userId: number, parentId: number): Promise<ResponseResult> {
        const url = `${this._configurationService.apiFsFolder}/getsbyparent?userId=${userId}&parentId=${parentId}`;
        return this.http
            .get<ResponseResult>(url)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    CreateFolder(parentId: number, foldername: string): Promise<ResponseResult> {
        const url = `${this._configurationService.apiFsFolder}/Create?parentId=${parentId}&folderName=${foldername}`;
        return this.http
            .get<ResponseResult>(url)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    post(item: any): Promise<ResponseResult> {
        const url = `${this._configurationService.apiFsFolder}`;
        return this.http
            .post<ResponseResult>(url, item)
            .pipe(catchError(err => this.handleError(err, this.injector))).toPromise();
    }

    foGetFolderTree(userId: number): Promise<ResponseResult> {
        const url = `${this._configurationService.apiFsFolder}/getfoldertree?userId=${userId}`;
        return this.http
            .get<ResponseResult>(url)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    fiGetsInFolder(userId: number, folderId: number): Promise<ResponseResult> {
        const url = `${this._configurationService.apiFsFile}/getsinfolder?userId=${userId}&folderId=${folderId}`;
        return this.http
            .get<ResponseResult>(url)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    fiGetById(id: string): Promise<ResponseResult> {
        const url = `${this._configurationService.apiFsFile}/getinfo?id=${id}`;
        return this.http
            .get<ResponseResult>(url)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    GetsByIds(ids: string): Promise<ResponseResult> {
        const obj = {
            ids: ids
        }
        const url = `${this._configurationService.apiFsFile}/GetsByIds`;
        return this.http
            .post<ResponseResult>(url, obj)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    deleteFile(file) {
        const url = `${this._configurationService.apiFsFile}/deletebyids?ids=${file.id}`;
        return this.http
            .get<ResponseResult>(url)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    deleteFolder(userid, folderId) {
        const url = `${this._configurationService.apiFsFolder}/deletebyfolderid?userid=${userid}&folderid=${folderId}`;
        return this.http
            .get<ResponseResult>(url)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }

    handleError(error: any, injector: Injector) {
        // console.error('Có lỗi xảy ra', error);
        if (error.status === 401) {
            let authenService = injector.get(VsAuthenService);
            authenService.logout();
        } else {
            // console.log('Lỗi chung chung');
        }
        return Promise.reject(error);
    }

    mergeFilesDoc(ids: string): Promise<ResponseResult> {
        const obj = {
            ids: ids
        };
        const url = `${this._configurationService.apiFsFile}/MergeFilesDoc`;
        return this.http
            .post<ResponseResult>(url, obj)
            .pipe(retry(1), catchError(err => this.handleError(err, this.injector))).map(rs => rs).toPromise();
    }
}

export enum FileViewerType {
    Image, OfficeFile, Other
}
