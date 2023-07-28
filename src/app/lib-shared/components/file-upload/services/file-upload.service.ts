import { Injectable } from '@angular/core';
import { ModuleConfigService } from '../../../services/module-config.service';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VsFileUploadService {
    apiUrl = '';

    constructor(
        private _moduleConfigService: ModuleConfigService,
        private _http: HttpClient
    ) {
        this.apiUrl = _moduleConfigService.getConfig().ApiFileUpload;
    }

    deleteFile(fileUrl) { }

    getLinkDownload(fileName) {
        return environment.apiDomain.fileEndpoint + '/upload?file=' + fileName;
        // return this.apiUrl + '?file=' + fileName;
    }

    getLinkDownloadById(id) {
        return environment.apiDomain.fileEndpoint + '/FsFiles/getfile?id=' + id;
        // return this.apiUrl + '?file=' + fileName;
    }

    getRaw(id) {
        return this._http.get<string>(environment.apiDomain.fileEndpoint + '/FsFiles/getraw?id=' + id).toPromise();
        // return this.apiUrl + '?file=' + fileName;
    }
    getLinkDownloadNoFile(usingInserver?: boolean): string {
        // return environment.apiDomain.fileEndpoint + '/upload?file=';
        if (usingInserver) {
            return 'https://file.api/api/v1/upload?file=';
        } else {
            // string url ='environment.clientDomain.file_domain/file.api/api/v1/upload?file
            return environment.apiDomain.fileEndpoint + '/upload?file=';
        }
    }
    getRawFileName(fileName: string): string {
        if (fileName) {
            if (fileName.indexOf('_') > -1) {
                return fileName.substr(fileName.indexOf('_') + 1);
            }
        }
        return fileName;
    }
}
