import { Injectable } from '@angular/core';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';
import { VsCommonService } from '../services/vs-common.service';

@Injectable()
export class VsAuthenService {

    constructor(
        private auth: OAuthService,
        private commonService: VsCommonService,
        private _oauthService: OAuthService,
    ) {

    }

    logout() {
        try {
            // this.remoteStorage.clear();
            localStorage.clear();
            sessionStorage.clear();
            this.auth.logOut();
        } finally {

        }

        const returnUrl = `?return=${encodeURIComponent(window.location.href)}`;
        // if (window.location.origin !== environment.apiDomain.remoteStorageOrigin) {
        //     returnUrl = `?return=${encodeURIComponent(window.location.href)}&domain=${encodeURIComponent(window.location.origin)}`;
        // }

        window.location.href = `${environment.apiDomain.authenticationEndpoint}/Account/Logout?return=${returnUrl}`;

    }

    getAccessToken() {
        return this._oauthService.getAccessToken();
    }
}
