import { environment } from '../../environments/environment';
import { SignalRConfiguration } from 'ng2-signalr';

export function signalrConfig(): SignalRConfiguration {
    const c = new SignalRConfiguration();
    c.hubName = 'ccclient';
    c.qs = { key: 'webapp' };
    c.url = `${environment.signalr.endpoint}`;
    c.logging = true;

    c.executeEventsInZone = true;
    c.executeErrorsInZone = false;
    c.executeStatusChangeInZone = true;
    return c;
}
