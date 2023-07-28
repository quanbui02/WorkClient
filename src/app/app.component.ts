import { Component, AfterViewInit, Renderer2, ViewChild, OnDestroy, OnInit, Input, Injector } from '@angular/core';
import { ScrollPanel } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from './config/oidc-auth.config';
import { Subject } from 'rxjs/internal/Subject';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { HeartBeatService } from './services/heart-beat.service';
import { environment } from '../environments/environment';
import { VsMySetting } from './models/ccmysetting';
import { VsMySettingService } from './services/ccmysetting.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VsAppNavigationItem } from './models/app-navigation-item';
import { ConfigurationService } from './lib-shared/services/configuration.service';
import { AuthorizeService } from './lib-shared/services/authorize.service';
import { VsAuthenService } from './lib-shared/auth/authen.service';
import { GlobalService } from './services/global.service';
import { ProfileComponent } from './profile/profile.component';
import { CommonService } from './lib-shared/services/common.service';
import { HtMenuService } from './lib-shared/services/htmenu.service';
import { UserService } from './lib-shared/services/user.service';

enum MenuOrientation {
    STATIC,
    OVERLAY,
    SLIM,
    HORIZONTAL
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy, OnInit {

    // Private
    private _unsubscribeAll: Subject<any>;
    private _sub: Subscription;

    layoutMode: MenuOrientation = MenuOrientation.STATIC;

    darkMenu = false;

    profileMode = 'top';

    rotateMenuButton: boolean;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive = true;

    staticMenuMobileActive: boolean;

    layoutMenuScroller: HTMLDivElement;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    resetMenu: boolean;

    menuHoverActive: boolean;
    currentRoute = '';
    pageLoaded = false;

    @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ScrollPanel;
    @ViewChild('changePassword') changePassword: ChangePasswordComponent;
    @ViewChild('profile') profile: ProfileComponent;


    appMenuModel: any[];
    searchMenuResult: any[];
    searchMenuInput: string;

    showPinnedMenu = false;
    isInPinnedMenu = false;
    isSearchMenuInputFocus = false;
    mySetting = new VsMySetting();
    listAppNav: VsAppNavigationItem[] = [];
    tokenProcessing = false;

    constructor(
        public renderer: Renderer2,
        private translate: TranslateService,
        private _oauthService: OAuthService,
        private _userService: UserService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _heartBeatService: HeartBeatService,
        public _commonService: CommonService,
        private _menuService: HtMenuService,
        private _authorizeService: AuthorizeService,
        private _mySettingService: VsMySettingService,
        private _tnAuthenService: VsAuthenService,
        private _globalService: GlobalService,
        private injector: Injector,
        private _configurationService: ConfigurationService,
    ) {
        this.translate.setDefaultLang('vn');
        this.translate.use('vn');
        this.mySetting = this._mySettingService.getCurrentSetting();
        // this.mySetting.idHe = 2;
        // console.log(environment);
        // Config for authentication
        this.configureWithNewConfigApi();

        this._router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                const newKey = this.newGuid();
                sessionStorage.setItem(this._configurationService.logSessionKey, newKey);
            }
        });
    }

    ngAfterViewInit() {
        // setTimeout(() => { this.layoutMenuScrollerViewChild.moveBar(); }, 100);
    }

    ngOnInit() {
        if (!environment.production) {
            // for dev evironment
            setInterval(() => {
                this._heartBeatService.sendHeartBeat();
            }, 70000);
        }


        this.listAppNav.push({ icon: 'icon-g-qtc', text: 'Quản trị hệ thống', url: environment.clientDomain.qthtDomain });
        this.listAppNav.push({ icon: 'icon-g-qtc', text: 'Friends', url: environment.clientDomain.friendDomain });

    }

    private async configureWithNewConfigApi() {
        this._oauthService.setStorage(localStorage);
        this._oauthService.configure(authConfig);
        this._oauthService.tokenValidationHandler = new JwksValidationHandler();

        // this._oauthService.events.subscribe(async evt => {
        //     // for first login
        //     if (evt.type === 'received_first_token' || evt.type === 'token_received') {
        //         this.tokenProcessing = true;
        //         this._globalService.setUserReadyPopulate(true);
        //         await this._authorizeService.fetchAuthorization();
        //         this.pageLoaded = true;
        //         const oldUrl = localStorage.getItem('currentUrl');
        //         if (oldUrl && oldUrl !== top.location.href + '') {
        //             // need redirect to old page
        //             localStorage.removeItem('currentUrl');
        //             top.location.href = oldUrl;
        //         }
        //     } else if (evt.type === 'token_expires') {
        //         this._oauthService.tryLogin();
        //     } else if (evt.type === 'logout') {

        //     } else if (evt.type === 'session_terminated') {
        //         // logout
        //         this._tnAuthenService.logout();
        //     }

        //     // setTimeout(() => { this.tokenProcessing = false; }, 500);
        // });

        if (!this._oauthService.hasValidAccessToken()) {
            // if (!localStorage.getItem('currentUrl')) {
            //     localStorage.setItem('currentUrl', top.location.href);
            // }
            this._oauthService.loadDiscoveryDocumentAndTryLogin().then(async rs => {
                if (!rs) {
                    this._oauthService.initImplicitFlow();
                } else {
                    this._userService.returnPromises();
                    this._oauthService.loadDiscoveryDocument();
                    await this._authorizeService.fetchAuthorization();
                    this.pageLoaded = true;
                    this.loadMenu();
                    this.LoadConfig();
                }
            });
        } else {
            this._userService.returnPromises();
            this._oauthService.loadDiscoveryDocument();
            await this._authorizeService.fetchAuthorization();
            this.pageLoaded = true;
            this.loadMenu();
            this.LoadConfig();
        }

        // Optional
        this._oauthService.setupAutomaticSilentRefresh();
    }

    loadMenu() {
        // const cacheVal = sessionStorage.getItem('htMenu' + environment.clientDomain.idPhanhe.toString());
        // if (cacheVal !== undefined && cacheVal !== null) {
        //     this.appMenuModel = JSON.parse(cacheVal);
        // } else {
        this._menuService.getByIdPhanHe(environment.clientDomain.idPhanhe, 0).then(rs => {
            if (rs.status) {
                this.appMenuModel = rs.data;
                // sessionStorage.setItem('htMenu' + environment.clientDomain.idPhanhe.toString(), JSON.stringify(rs.data));
            }
        });
        // }
    }

    LoadConfig() {
        this._userService.LoadConfig().then(rs => {
            if (rs.status) {
                // Bắt phải logout ra
                if (rs.data.isLogout === true) {
                    this._userService.UpdateIsLogout();
                    const authenService = this.injector.get(VsAuthenService);
                    authenService.logout();
                }
            }
        });
    }


    // onLayoutClick() {
    //     if (!this.topbarItemClick) {
    //         this.activeTopbarItem = null;
    //         this.topbarMenuActive = false;
    //     }

    //     if (!this.menuClick) {
    //         if (this.isHorizontal() || this.isSlim()) {
    //             this.resetMenu = true;
    //         }

    //         if (this.overlayMenuActive || this.staticMenuMobileActive) {
    //             this.hideOverlayMenu();
    //         }

    //         this.menuHoverActive = false;
    //     }

    //     this.topbarItemClick = false;
    //     this.menuClick = false;
    // }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if (this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
            }
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;

        if (!this.isHorizontal()) {
            setTimeout(() => { this.layoutMenuScrollerViewChild.moveBar(); }, 450);
        }
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }


    onSwitchModule(moduleCode) {
        switch (moduleCode) {
            case 1: {
                this._router.navigate([environment.clientDomain.qthtDomain]);
                break;
            }
            default: { // frontend
                this._router.navigate([environment.clientDomain.appDomain]);
                break;
            }
        }
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onEditInfo(event) {
        event.preventDefault();
        this.profile.showPopup(this._userService.getBasicUserInfo().userId);
    }

    onChangePassword(event) {
        event.preventDefault();
        this.changePassword.showPopup(this._userService.getBasicUserInfo().userId);
    }

    onTopbarLogout() {
        localStorage.clear();
        sessionStorage.clear();
        this._oauthService.logOut();
        const returnUrl = `?return=${encodeURIComponent(window.location.href)}`;

        window.location.href = `${environment.apiDomain.authenticationEndpoint}/Account/Logout?return=${returnUrl}`;
    }

    hideOverlayMenu() {
        this.rotateMenuButton = false;
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }

    isSlim() {
        return this.layoutMode === MenuOrientation.SLIM;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    changeToHorizontalMenu() {
        this.layoutMode = MenuOrientation.HORIZONTAL;
    }

    changeToSlimMenu() {
        this.layoutMode = MenuOrientation.SLIM;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._sub.unsubscribe();
    }

    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // search menu
    onSearchMenu(event) {
        this.searchMenuResult = [];

        if (!event || !event.query) {
            return;
        }

        this.searchMenuResult = this.getSearchMenuResult(event.query);
    }

    getSearchMenuResult(keyword) {
        const result = [];
        this.regroupSearchMenuResult(keyword, this.appMenuModel, result);
        return result;
    }

    private regroupSearchMenuResult(keyword: string, listToGet: any[], listToPush: any[]) {
        listToGet.forEach(item => {
            if (item.items && item.items.length) {
                this.regroupSearchMenuResult(keyword, item.items, listToPush);
            }

            if (item.trangThai === 1
                && (item.label.toUpperCase().indexOf(keyword.toUpperCase()) >= 0)) {
                listToPush.push(item);
            }
        });
    }

    onMouseOverPinnedMenu() {
        this.isInPinnedMenu = true;
    }

    onMouseLeavePinnedMenu() {
        this.isInPinnedMenu = false;
        if (this.isSearchMenuInputFocus) {
            return;
        }

        this.searchMenuInput = '';
        this.showPinnedMenu = false;
    }

    onSelectMenuSuggestion(menuItemObj) {
        this._router.navigateByUrl(menuItemObj.routerLink);
        this.searchMenuInput = '';
        this.showPinnedMenu = false;
    }

    onBlurSearchMenuInput(event) {
        this.isSearchMenuInputFocus = false;
        if (this.isInPinnedMenu) {
            return;
        }

        this.searchMenuInput = '';
        this.showPinnedMenu = false;
    }

    onFocusSearchMenuInput(event) {
        this.isSearchMenuInputFocus = true;
        this.showPinnedMenu = true;
    }
}

