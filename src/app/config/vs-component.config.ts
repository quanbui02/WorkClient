import { environment } from '../../environments/environment';
import { ModuleConfig } from '../lib-shared/configs/module-config';

export const PS_COMPONENT_CONFIG = <ModuleConfig>{
    Services: {
        Gateway: environment.apiDomain.gateway,
        FileEndpoint: environment.apiDomain.fileEndpoint,
        NotificationEndpoint: environment.apiDomain.notificationEndpoint
    },
    Assets: {
        LogoUrl: environment.appMetadata.appDomain.logo
    },
    Signalr: {
        Key: environment.signalr.clientKey,
        LinkDownloadClientApp: environment.signalr.linkDownloadClientApp
    }
};
