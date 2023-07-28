import { Injectable } from '@angular/core';
import { VsAppNavigationItem } from '../models/app-navigation-item';
import { environment } from '../../../environments/environment';
import { OAuthStorage } from 'angular-oauth2-oidc';

@Injectable()
export class VsApplicationManagementService {

    constructor(private _authStorage: OAuthStorage) { }

    getListNavigation(): VsAppNavigationItem[] {
        //filter display navigation by permission
        let permissions = this._authStorage.getItem('permissions');
        if (permissions)
            permissions = JSON.parse(permissions);
        // tslint:disable-next-line:prefer-const
        let items: VsAppNavigationItem[] = [];

        // items.push(<VsAppNavigationItem>{
        //   icon: 'fa fa-globe',
        //   text: 'Cổng thông tin cá nhân',
        //   url: environment.clientDomain.portalDomain
        // });
        // if (permissions && (permissions['authentication.api'] || permissions['authorization.api'] || permissions['danhmuc.api'] || permissions["supperUser"])) {
        //   // items.push(<VsAppNavigationItem>{
        //   //     icon: 'fa fa-user',
        //   //     text: 'Quản trị hệ thống',
        //   //     url: environment.clientDomain.adminDomain
        //   // });
        // }

        // if (permissions && (permissions['qlns.api'] || permissions["supperUser"])) {
        //   items.push(<VsAppNavigationItem>{
        //     icon: 'fa fa-sitemap',
        //     text: 'Quản lý nhân sự',
        //     url: environment.clientDomain.qlnsDomain
        //   });
        // }

        // if (permissions && (permissions['nckh.api'] || permissions["supperUser"])) {
        //   items.push(<VsAppNavigationItem>{
        //     icon: 'fa fa-folder-open',
        //     text: 'Quản lý khoa học',
        //     url: environment.clientDomain.nckhDomain
        //   });
        // }

        // if (permissions && (permissions['qldt.api'] || permissions["supperUser"])) {
        //   items.push(<VsAppNavigationItem>{
        //     icon: 'fa fa-table',
        //     text: 'Quản lý đào tạo',
        //     url: environment.clientDomain.qldtDomain
        //   });
        // }

        // if (permissions && (permissions['qlhc.api'] || permissions["supperUser"])) {
        //   items.push(<VsAppNavigationItem>{
        //     icon: 'fa fa-tags',
        //     text: 'Quản lý hành chính',
        //     url: environment.clientDomain.qlhcDomain
        //   });
        // }

        return items;
    }
}
