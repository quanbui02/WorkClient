import { Injectable } from '@angular/core';
import { ModuleConfigService } from './module-config.service';
import { SignalR, SignalRConnection, ConnectionStatus } from 'ng2-signalr';
import { VsClientCommand } from '../models/vs-client-command';
import { Subject } from 'rxjs';
import { ModuleConfig } from '../configs/module-config';

@Injectable({
    providedIn: 'root'
})
export class VsClientService {
    private _moduleConfig: ModuleConfig;
    private _connection: SignalRConnection;
    private _connected = false;
    private _connectedChanged = new Subject<boolean>();

    constructor(
        private _moduleConfigService: ModuleConfigService,
        private _signalR: SignalR
    ) {
        // this._moduleConfig = this._moduleConfigService.getConfig();
        this.init();
    }

    private init() {
        this.createConnectionSignalR();

        this._connection.status.subscribe((status: ConnectionStatus) => {
            if (status.name !== 'connected') {
                this._connected = false;
                this._connectedChanged.next(this._connected);
            }

            if (status.name === 'connected') {
                this._connected = true;
                this._connectedChanged.next(this._connected);
            }


            if (status.name === 'disconnected' && status.value === 4) {
                // retry to connect
                this.createConnectionSignalR();
            }
        });

        this._connection.errors.subscribe((error: any) => {
            console.error('signalr error', error);
        });
    }

    createConnectionSignalR(): void {
        this._connection = this._signalR.createConnection();
        this._connection.start().then(result => {
            this._connected = true;
            this._connectedChanged.next(this._connected);
        });
    }

    sendCommand(command: VsClientCommand): string {
        if (!this._connected) {
            return 'ERR_NOT_CONNECTED';
        }

        command.sourceConnectionId = this._connection.id;

        this._connection.invoke('SendCommand', command);

        return '';
    }

    stopConnection() {
        this._connection.stop();
    }

    isConnected() {
        return this._connected;
    }
}
