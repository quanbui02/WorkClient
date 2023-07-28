import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileIcon'
})
export class FileIconPipe implements PipeTransform {

    transform(fileName: string, isFolder?: boolean, width?: number, height?: number): string {
        if (!fileName) {
            return '';
        }

        if (!isFolder) {
            isFolder = false;
        }

        if (!width) {
            width = 16;
        }

        if (!height) {
            height = 16;
        }

        if (isFolder) {
            return `<img width='${width}' height='${height}' src='/assets/images/file-ext/icon.folder.png' />`;
        } else {
            const fileExtArr = fileName.split('.');
            const fileExt    = fileExtArr[fileExtArr.length - 1];
            return `<img width='${width}' height='${height}' src='/assets/images/file-ext/icon.${fileExt}.png' onerror='this.src = '/assets/images/file-ext/file-empty.png';' />`;
        }
    }

}
