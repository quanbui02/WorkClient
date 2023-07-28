import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { ModuleConfig } from '../configs/module-config';
import { ModuleConfigService } from './module-config.service';
import { VsAuthenService } from '../auth/authen.service';
import { TopicUsersService } from './topicusers.service';

@Injectable()
export class SignalRService {
    private _moduleConfig: ModuleConfig;
    private _hubConnection: HubConnection;

    maxRetryTimes = 10;
    viewCodeSubs: {
        viewCode: string,
        callback: (data: any) => void
    }[];

    constructor(
        private _moduleConfigService: ModuleConfigService,
        private _TopicUsersService: TopicUsersService,
        private _authenService: VsAuthenService
    ) {
        this._moduleConfig = this._moduleConfigService.getConfig();
    }

    start(hub: string, viewCode: string, callback: () => void) {
        // kết nối lần đầu
        this.createConnection(hub);
        this.startConnection().then(rs => {
            this.subscribeViewCode(viewCode, callback);
            this.autoReconnect(hub);
        });

        // // Cứ sau 5 phút thì refresh lại kết nối
        // setInterval(() => {
        //     this.createConnection(hub);
        //     this.startConnection().then(rs => {
        //         this.subscribeViewCode(viewCode, callback);
        //         //this.autoReconnect(hub);
        //     });
        // }, 5000)  // 5 phút reconnect lại để đảm bảo không bị mất kết nối
    }

    startList(hub: string, viewCode: string[], callback: () => void) {
        this.createConnection(hub);
        this.startConnection().then(rs => {
            viewCode.forEach(element => {
                this.subscribeViewCode(element, callback);
            });
            this.autoReconnect(hub);
        });
    }

    stop() {
        this._hubConnection.stop();
    }

    subscribeViewCode(viewCode: string, callback: (data: any) => void) {
        if (this.viewCodeSubs !== undefined) {
            this.viewCodeSubs.push({ viewCode, callback });
        } else {
            this.viewCodeSubs = [{ viewCode, callback }];
        }

        this.subscribe(viewCode, callback);
    }

    private createConnection(hub: string) {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this._moduleConfig.Services.NotificationEndpoint}/${hub}`,
                { accessTokenFactory: () => this._authenService.getAccessToken() })
            .build();
    }

    private autoReconnect(topic: string) {
        this._hubConnection.onclose(async () => {
            await this.startConnection();
        });
    }

    private wait = ms => new Promise(r => setTimeout(r, ms));

    private startConnection(retryCount = 1): Promise<any> {
        return new Promise(async (resolve, reject) => {
            // not sure about it :)))
            // https://github.com/aspnet/SignalR/issues/2389
            Object.defineProperty(WebSocket, 'OPEN', { value: 1, });
            this._hubConnection
                .start().then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    if (this.maxRetryTimes - retryCount > 0) {
                        return this.wait(retryCount * retryCount * 1000)
                            .then(this.startConnection.bind(this, ++retryCount))
                            .then(resolve)
                            .catch(reject);
                    }
                    return reject(err);
                });
        });
    }

    private subscribe(viewCode: string, callback: (data: any) => void) {
        this._hubConnection.invoke('Join', viewCode).catch(err => console.error(err.toString()));
        this._hubConnection.on(viewCode, (data: any) => {
            callback(data);
        });
    }


    //CUSTOM SEND
    private createConnectionDapFoodAPI(hub: string) {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl(`https://devnotification.dapfood.net/NotificationHub`, {
                // accessTokenFactory: () => this._authenService.getAccessToken(),
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .build();
    }

    SendDataWeb(hub: string, Method: string[], data: any) {
        this.createConnectionDapFoodAPI(hub);
        this.startConnection().then(rs => {
            Method.forEach(element => {
                this.sendDataByViewCode(element, data);
            });
            this.autoReconnect(hub);
        });
    }

    private sendDataByViewCode(Method: string, data: any) {
        this._hubConnection.invoke(Method, data).catch(err => console.error(err.toString()));
    }
}
