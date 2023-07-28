import { IVsBaseModel, VsBaseModel } from "./base.model";

export class VsThongBao extends VsBaseModel {
    noiNhan: string[];
    tieuDe: string;
    noiDung: string; y
    dinhKem: string;
    guiSMS: boolean;
    guiEmail: boolean;
    constructor() {
        super();
        this.noiNhan = [];
        this.tieuDe = "";
        this.noiDung = "";
        this.dinhKem = "";
        this.guiEmail = true;
        this.guiSMS = false;
    }
}
export class VsNoifyMessage extends VsBaseModel {
    title: string = "Tiêu đề";
    content: string = "Nội dung";
    icon: string = "1.png";
    attachment: string = "";
    link = '';
    constructor() {
        super();
        this.title = "Tiêu đề";
        this.content = "Nội dung";
        this.icon = "1.png";
        this.attachment = "";
    }
}
export class VsNotify extends VsBaseModel {
    type: number = 1;
    sendTo: Array<string> = [];
    message: VsNoifyMessage;
    constructor() {
        super();
        this.type = 1;
        this.sendTo = [];
        this.message = new VsNoifyMessage;
    }
}

