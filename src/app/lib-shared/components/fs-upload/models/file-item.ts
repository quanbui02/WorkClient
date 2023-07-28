export class VsFsFileItem {
    id: string;
    fileName: string;
    folderId: number;
    fileExt: string;
    createdByUser: string;
    createdDate: Date;
    size: number;
    status: boolean;
    rawFileName: string;
    linkViewOnline: string;
    linkZoom: string;
    typeId: number; // 1: file 2: folder
    displayPath: string;
    idPath: string;
    path: string;
    checked: boolean;
    isvirtual: boolean;
}
