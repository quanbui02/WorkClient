export class VsClientCommand {
    key: string;
    commandType: CommandType;
    data: any;
    message: string;
    error: string;
    sourceConnectionId: string;
}

export enum CommandType {
    GetOfficeVersion = 0,
    EditFile = 1,
    Save = 2,
    SaveDraft = 3
}
