import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthorizeService } from '../../lib-shared/services/authorize.service';
import { PermissionTypes } from '../vs-constants';
import { environment } from '../../../environments/environment';
import { ConfigurationService } from '../services/configuration.service';
import { UserService } from '../services/user.service';

@Injectable()
export class GuardService implements CanActivate {
    constructor(
        private _authenService: OAuthService,
        private _authenStorage: OAuthStorage,
        private _router: Router,
        private _authorizeService: AuthorizeService,
        private _userService: UserService,
        private _configurationService: ConfigurationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const guard = this;
        let returnUrl = '';

        return new Promise(resolve => {
            if (!guard._authenService.hasValidAccessToken()) {
                guard._authenService.clientId = this._authenStorage.getItem('clientId') || environment.authenticationSettings.clientId;
                guard._authenService.loadDiscoveryDocumentAndTryLogin().then(rs => {
                    if (rs) {
                        this._authorizeService.fetchAuthorization().then(e => {
                            if (this._userService.getBasicUserInfo().issuperuser) {
                                resolve(true);
                                return;
                            }

                            if (!route.data || !route.data.permissionRequired
                                || guard._authorizeService.validated(route.data.permissionRequired, PermissionTypes.PAGE)) {
                                resolve(true);
                            } else {
                                guard._router.navigate(['/error/403']);
                                resolve(true);
                            }
                        });
                    }
                    else {
                        resolve(false);
                    }
                })
                    .catch(() => {
                        resolve(false);
                    });
            } else {
                if (this._userService.getBasicUserInfo().issuperuser) {
                    resolve(true);
                    return;
                }

                if (!route.data || !route.data.permissionRequired
                    || guard._authorizeService.validated(route.data.permissionRequired, PermissionTypes.PAGE)) {
                    resolve(true);
                } else {
                    guard._router.navigate(['/error/403']);
                    resolve(true);
                }
            }
        });
    }
}
