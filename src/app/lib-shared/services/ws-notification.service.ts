import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { WebsocketService } from './web-socket.service';
import { environment } from '../../../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class WsNotificationService {
    public messages: Subject<NotificationPayload>;

    constructor(wsService: WebsocketService, private _oauthService: OAuthService) {
        // this.messages = <Subject<NotificationPayload>>wsService
        //   .connect(environment.apiDomain.webHook + '?access_token=' + this._oauthService.getAccessToken())
        //   .map((response: MessageEvent): NotificationPayload => {
        //     const data = JSON.parse(response.data);
        //     return {
        //       id: data.id,
        //       title: data.title,
        //       content: data.content,
        //       icon: data.icon,
        //       time: data.time
        //     };
        //   });

    }
}

export class Message {
    id: string;
    title: string;
    content: string;
    icon: string;
}
export interface NotificationPayload {
    id: string;
    title: string;
    content: string;
    icon: string;
    time: Date;
}


export interface Notification {
    type: string;
    sendTo: string;
    message: Message;
}
