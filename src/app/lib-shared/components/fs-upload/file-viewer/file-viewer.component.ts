import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';

declare var DocsAPI: any;

@Component({
    selector: 'file-viewer',
    templateUrl: './file-viewer.component.html',
    styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnInit {

    @Input() FileUrl: string = '';
    @Input() FileName: string = '';

    screenHeight = window.screen.height - 300;
    screenWidth = window.screen.width - 100;
    showFileDialog = false;

    isImage = false;

    constructor() { }
    ngOnInit() {

    }

    showPopup(FileName: string, FileUrl: string) {
        this.FileUrl = FileUrl;
        this.FileName = FileName;
        const fileType = this.getFileType(this.FileName);
        const documentType = this.getDocumentType(fileType);
        if (documentType == 'image') {
            this.isImage = true;
        }
        // else {
        //     this.isImage = false;
        //     this.initDocumentViewer(fileType, documentType);
        // }
        this.showFileDialog = true;
    }

    initDocumentViewer(fileType, documentType) {

        const logoUrl = `${environment.clientDomain.appDomain}/${environment.appMetadata.appDomain.logo}`;

        let config = {
            'height': '100%',
            'width': '100%',
            'documentType': `${documentType}`,
            'editorConfig': {
                'mode': 'view',
                'customization': {
                    'chat': false,
                    'compactToolbar': true,
                    'logo': {
                        'image': `${logoUrl}`,
                        'imageEmbedded': `${logoUrl}`
                    },
                    'about': false,
                    'comments': false
                }
            },
            'document': {
                'permissions': {
                    'comment': false,
                    'download': true,
                    'edit': false,
                    'print': true,
                    'review': false,
                    'reader': true
                },
                'fileType': `${fileType}`,
                'title': `${this.FileName}`,
                'url': `${this.FileUrl}`
            }
        };
        const docEditor = new DocsAPI.DocEditor('file-viewer', config);
    }
    getFileType(fileName: string) {
        const arr = fileName.split('.');
        return arr[arr.length - 1];
    }

    getDocumentType(fileType: string) {
        if ((/(gif|jpg|jpeg|tiff|png)$/i).test(fileType)) {
            return 'image';
        } else if ((/(doc|docm|docx|dot|dotm|dotx|epub|fodt|htm|html|mht|odt|ott|pdf|rtf|txt|djvu|xps)$/i).test(fileType)) {
            return 'text';
        } else if ((/(csv|fods|ods|ots|xls|xlsm|xlsx|xlt|xltm|xltx)$/i).test(fileType)) {
            return 'spreadsheet';
        } else if ((/(fodp|odp|otp|pot|potm|potx|pps|ppsm|ppsx|ppt|pptm|pptx)$/i).test(fileType)) {
            return 'presentation';
        }

        return '';
    }
}
