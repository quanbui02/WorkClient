export interface ModuleConfig {
    IsDebugMode?: boolean;
    IsEnabled?: boolean;

    Services: any;

    // Services: {
    //     Gateway: string;
    //     FileEndpoint: string;
    //     NotificationEndpoint: string;
    //     StaffEndpoint: string;
    //     AuthorizationEndPoint: string;
    // };

    ApiFileUpload?: string;

    Assets: {
        LogoUrl: string;
    };

    Signalr: {
        Key: string;
        LinkDownloadClientApp: string;
    };

    LogSettings: {
        Enabled: boolean;
    };
}
