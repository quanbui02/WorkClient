import { Component } from '@angular/core';
import { OAuthStorage, OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-error403',
    templateUrl: './error403.component.html',
    styleUrls: ['./error403.component.scss']
})

export class Error403Component {
    constructor(
        private router: Router,
        private auth: OAuthService,
        private storage: OAuthStorage
    ) { }

    logout(): void {
        this.auth.logOut();
        this.storage.removeItem("permissions");
        // this.router.navigate(['/dang-nhap']);
        top.location.href = environment.clientDomain.appDomain;
    }
}
