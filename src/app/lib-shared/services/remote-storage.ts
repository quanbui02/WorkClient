import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class RemoteStorage {
    protected _init = false;
    protected _connected = false;
    protected _requests: any = {};
    protected _count = 0;

    public RpcFrame: HTMLIFrameElement;
    public Origin: string;
    public OnStorageChanged: EventEmitter<any> = new EventEmitter<any>();
    public Ready: boolean;

    constructor() { }

    init(endpoint: string): Promise<void> {
        const client = this;
        client.Origin = endpoint.substring(0, endpoint.indexOf('/', 8));

        return new Promise(resolve => {
            if (this._init) {
                console.warn('Remote Storage has been inited!');
                return;
            }

            client.RpcFrame = document.createElement('iframe');
            client.RpcFrame.id = client.uuid();
            client.RpcFrame.width = '1px';
            client.RpcFrame.height = '1px';
            client.RpcFrame.style.display = 'none';
            client.RpcFrame.style.position = '-9999px';
            client.RpcFrame.src = endpoint;
            client.RpcFrame.onload = () => {

                client._connected = true;
                client.RpcFrame.contentWindow.postMessage({
                    command: 'connect'
                }, this.Origin);
                client.Ready = true;
                resolve();
            };
            client._init = true;

            window.addEventListener('message', (response) => {
                if (response.data.event) {
                    // sync
                    if (response.data.payload.key == null && response.data.payload.oldValue == null && response.data.payload.newValue == null) {
                        localStorage.clear();
                        sessionStorage.clear();
                    }
                    else if (response.data.payload.key != null && response.data.payload.newValue == null) {
                        localStorage.removeItem(response.data.payload.key);
                        sessionStorage.removeItem(response.data.payload.key);
                    }
                    else {
                        localStorage.setItem(response.data.payload.key, response.data.payload.newValue);
                        sessionStorage.setItem(response.data.payload.key, response.data.payload.newValue);
                    }
                    client.OnStorageChanged.emit(response);
                }
                else if (response.data.sync) {

                }
                else if (response.data.id) {
                    if (client._requests[response.data.id]) {
                        client._requests[response.data.id](response.data.error, response.data.result);
                    }
                }
            });

            window.document.body.appendChild(client.RpcFrame);
        });
    }

    clear(): void {
        if (!this._connected) {
            console.error('Storage not connected!');
        }
        this.RpcFrame.contentWindow.postMessage({
            command: 'clear'
        }, this.Origin);
    }

    setItem(key: string, value: string): void {
        if (!this._connected) {
            console.error('Storage not connected!');
        }
        this.RpcFrame.contentWindow.postMessage({
            command: 'set',
            payload: {
                key: key,
                value: value
            }
        }, this.Origin);
    }

    async getItem(key: any): Promise<any> {
        if (!this._connected) {
            console.error('Storage not connected!');
        }

        const client = this;
        const requestId = `${client.RpcFrame.id}:${client._count}`;

        client._count++;
        return new Promise((resolve, reject) => {
            client._requests[requestId] = (err: string, result: string) => {
                delete client._requests[requestId];

                if (err) return reject(new Error(err));
                resolve(result);
            };

            client.RpcFrame.contentWindow.postMessage({
                command: 'get',
                id: requestId,
                payload: {
                    key: key
                }
            }, this.Origin);
        });
    }

    async syncStorage(): Promise<any> {
        if (!this._connected) {
            console.error('Storage not connected!');
        }

        return new Promise((resolve) => {
            this.getItem('*').then((result) => {
                if (result) {
                    result.forEach(function (item) {
                        localStorage.setItem(item.key, item.value);
                        sessionStorage.setItem(item.key, item.value);
                    });

                    resolve();
                }
            });
        });
    }

    protected uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
