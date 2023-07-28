import { VsBaseModel } from "./base.model";

export class VsLog extends VsBaseModel {
    id: string;
    service: string;
    tag: string;
    logType: number;
    logData: string;
    logTime: Date;
    constructor() {
        super();
    }
}

