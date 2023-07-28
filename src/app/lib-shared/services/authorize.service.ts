import { Injectable } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';
import * as JWT from 'jwt-decode';
import { PermissionTypes } from '../vs-constants';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { debug } from 'util';
import { UserService } from './user.service';
import { User } from '../models/user';

@Injectable()
export class AuthorizeService {

    constructor(
        private _userService: UserService,
        private _authStorage: OAuthStorage,
        private _http: HttpClient
    ) { }

    fetchAuthorization(): Promise<any> {
        return new Promise((resolve, reject) => {
            const user = this._userService.getBasicUserInfo();

            if (user == null) {
                reject('ERR_FETCH_USEREMPTY');
                return;
            }
            if (user.issuperuser) {
                this._authStorage.setItem('permissions', JSON.stringify({ supperUser: true }));
                resolve();
            } else {
                // this._authStorage.setItem('permissions', user.permissions);
                // resolve();
                const url = `${environment.apiDomain.authorizationEndpoint}/AppPermissions/Granted/user/${user.userId}`;
                this._http.get<any>(url).subscribe((result) => {
                    if (result.success === true) {
                        // sessionStorage.setItem('permissions', JSON.stringify(result.data));
                        this._authStorage.setItem('permissions', JSON.stringify(result.data));
                        resolve();
                    } else {
                        reject('ERR_FETCH_USERPERMISSION');
                    }
                }, (error) => {
                    reject(error);
                });
            }
        });
    }

    validated(permissionRequired: any, type: PermissionTypes): boolean {

        const _permissions = this._authStorage.getItem('permissions');
        let _granted = null;

        try {
            if (_permissions == null || _permissions === '') { return false; }
            _granted = JSON.parse(_permissions);

            if (_granted == null) { return false; }
            if (_granted.supperUser) { return true; }

            let accessGranted = true;
            const services = Object.keys(permissionRequired);

            // tslint:disable-next-line:forin
            for (const i in services) {
                const serviceName = services[i];

                if (!_granted.hasOwnProperty(serviceName)) {
                    accessGranted = false;
                    break;
                }

                const controllers = Object.keys(permissionRequired[serviceName]);

                // tslint:disable-next-line:forin
                for (const j in controllers) {
                    const controllerName = controllers[j];

                    if (!_granted[serviceName].hasOwnProperty(controllerName)) {
                        accessGranted = false;
                        break;
                    }

                    const bitRequired = permissionRequired[serviceName][controllerName];
                    const bitGranted = _granted[serviceName][controllerName];

                    // tslint:disable-next-line:no-bitwise
                    if (((bitGranted & bitRequired) === 0) && (type === PermissionTypes.PAGE && bitRequired !== 0)) {
                        accessGranted = false;
                        break;
                    }

                    // tslint:disable-next-line:no-bitwise
                    if (((bitGranted & bitRequired) === 0) && (type === PermissionTypes.CONTROL && bitRequired !== 0)) {
                        accessGranted = false;
                        break;
                    }
                }
            }

            return accessGranted;
        } catch (ex) {
            return false;
        }
    }
}
