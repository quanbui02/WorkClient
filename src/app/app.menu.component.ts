import { Component, Input, OnInit, EventEmitter, Output, Injector } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/primeng';
import { AppComponent } from './app.component';
import { Subject } from 'rxjs/internal/Subject';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { PermissionTypes } from './lib-shared/vs-constants';
import { HtMenuService } from './lib-shared/services/htmenu.service';
import { NotifierService } from './lib-shared/services/notifier.service';

@Component({
    selector: 'app-menu',
    template: `
        <ul app-submenu [item]="model" [level]="0" root="true" class="vs-main-menu layout-menu layout-main-menu clearfix"
            [pinnedMenuIds]="pinnedMenuIds" (onTogglePin)="togglePin($event)" [reset]="reset" visible="true" parentActive="true"></ul>
        <ul (mouseover)="mouseOverPinnedMenu()" (mouseleave)="mouseLeavePinnedMenu()"
            class="vs-pinned-menu show" [class.show]="showPinnedMenu && pinnedMenuData && pinnedMenuData.length">
            <li class="pinned" *ngFor="let item of pinnedMenuData;let i = index" [authorize]="item.phanQuyen"
                                [isNavigationPermission]="true"
                                [permissionType]="permissionType">
                <i class="fa fa-thumb-tack pinned-icon" (click)="unpinMenuItem(item.id)" title="Bỏ ghim"></i>
                <a class="ripplelink" [routerLink]="item.routerLink" routerLinkActive="active-menuitem-routerlink"
                   [routerLinkActiveOptions]="{exact: true}">
                    <div class="decoration">
                        <i class="fa fa-cube decorated-icon"></i>
                    </div>
                    <span class="menuitem-label">{{item.label}}</span>
                </a>
            </li>
        </ul>
    `
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    private _unsubscribeAll = new Subject<any>();

    @Input()
    model: any[];

    theme = 'blue';

    layout = 'blue';

    version = 'v3';

    @Output()
    onMouseOverPinnedMenu = new EventEmitter();

    @Output()
    onMouseLeavePinnedMenu = new EventEmitter();

    // danh sách id của các menu item được ghim
    pinnedMenuIds: number[] = [];

    pinnedMenuData: any[] = [];

    @Input()
    showPinnedMenu: boolean;

    permissionType: PermissionTypes = PermissionTypes.PAGE;

    private _menuService: HtMenuService;
    private _translateService: TranslateService;
    private _notifierService: NotifierService;

    constructor(public app: AppComponent, private _injector: Injector) {
        this._notifierService = this._injector.get(NotifierService);
        this._translateService = this._injector.get(TranslateService);
        this._menuService = this._injector.get(HtMenuService);
    }

    ngOnInit() {
        // this.getPinnedMenuData();
    }

    changeTheme(theme: string) {
        const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');

        if (this.version === 'v3') {
            themeLink.href = 'assets/theme/theme-' + theme + '.css';
        } else {
            themeLink.href = 'assets/theme/theme-' + theme + '-v4' + '.css';
        }

        this.theme = theme;

    }

    changeLayout(layout: string, special?: boolean) {
        const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');

        if (this.version === 'v3') {
            layoutLink.href = 'assets/layout/css/layout-' + layout + '.css';
        } else {
            layoutLink.href = 'assets/layout/css/layout-' + layout + '-v4' + '.css';
        }

        this.layout = layout;

        if (special) {
            this.app.darkMenu = true;
        }
    }

    changeVersion(version: string) {
        const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
        const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');

        if (version === 'v3') {
            this.version = 'v3';
            themeLink.href = 'assets/theme/theme-' + this.theme + '.css';
            layoutLink.href = 'assets/layout/css/layout-' + this.layout + '.css';
        } else {
            themeLink.href = 'assets/theme/theme-' + this.theme + '-v4' + '.css';
            layoutLink.href = 'assets/layout/css/layout-' + this.layout + '-v4' + '.css';
            this.version = '-v4';
        }

    }

    mouseOverPinnedMenu() {
        this.onMouseOverPinnedMenu.emit(null);
    }

    mouseLeavePinnedMenu() {
        this.onMouseLeavePinnedMenu.emit(null);
    }

    togglePin(id) {
        if (this.pinnedMenuIds.includes(id)) {
            this.unpinMenuItem(id);
        } else {
            this.pinMenuItem(id);
        }
    }

    unpinMenuItem(id) {
        this._menuService.unPinMenuItem(id)
            .then(rs => {
                if (rs.status) {
                    this.getPinnedMenuData(true);
                }
            }, error => {
                this._notifierService.showHttpUnknowError();
            });
    }

    pinMenuItem(id) {
        this._menuService.pinMenuItem(id)
            .then(rs => {
                if (rs.status) {
                    this.getPinnedMenuData(true);
                }
            }, error => {
                this._notifierService.showHttpUnknowError();
            });
    }

    getPinnedMenuData(changed: boolean = false) {
        if (changed) {
            this._menuService.getsPinMenu(environment.clientDomain.idPhanhe).then(rs => {
                if (rs.status) {
                    const data = rs.data;
                    this.pinnedMenuData = data ? data : [];
                    this.pinnedMenuIds = data.map(item => item.id);
                    sessionStorage.setItem('htMenuPinned' + environment.clientDomain.idPhanhe.toString(), JSON.stringify(rs.data));
                }
            });
        } else {
            const cacheVal = sessionStorage.getItem('htMenuPinned' + environment.clientDomain.idPhanhe.toString());
            if (cacheVal !== undefined && cacheVal !== null) {
                const data = JSON.parse(cacheVal);
                this.pinnedMenuData = data ? data : [];
                this.pinnedMenuIds = data.map(item => item.id);
            } else {
                this._menuService.getsPinMenu(environment.clientDomain.idPhanhe).then(rs => {
                    if (rs.status) {
                        const data = rs.data;
                        this.pinnedMenuData = data ? data : [];
                        this.pinnedMenuIds = data.map(item => item.id);
                        sessionStorage.setItem('htMenuPinned' + environment.clientDomain.idPhanhe.toString(), JSON.stringify(rs.data));
                    }
                });
            }
        }
    }
}

@Component({
    selector: '[app-submenu]',
    template: `
    <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
        <li [ngClass]="[ 
                isNumber(level) ? 'menuitem-level-' + level : '',
                child.items ? 'has-submenu' : '',
                child.routerLink && child.routerLink !== '#' ? 'allow-click' : '',
                (level === 2) && (pinnedMenuIds.includes(child.id)) ? 'pinned' : '',
                1 > 0 ? 'menu-id-' + child.id : ''
            ]"
            [class]="child.badgeStyleClass" *ngIf="!(child.visible === false)"
            [hidden]="level > 2 || child.trangThai !== 1" [authorize]="child.phanQuyen"
                                [isNavigationPermission]="true"
                                [permissionType]="permissionType">

            <i class="fa fa-thumb-tack pinned-icon"
               title="{{pinnedMenuIds.includes(child.id) ? 'Bỏ ghim' : 'Ghim'}}"
               *ngIf="level === 2" (click)="togglePin(child.id)"></i>
            <a [routerLink]="child.routerLink" [routerLinkActive]="[child.routerLink ? 'active' : '']" class="ripplelink"
                [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                <div class="decoration" *ngIf="level === 2">
                    <i class="fa fa-cube decorated-icon"></i>
                </div>
                <i class="fa fa-caret-right menuitem-toggle-icon" *ngIf="level === 1"></i>
                <i class="main-icon" [ngClass]="child.icon"></i><span class="menuitem-label">{{child.label}}</span>
                <i class="fa fa-fw fa-angle-down menuitem-toggle-icon" *ngIf="child.items && level === 0"></i>
                <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
            </a>
            <div class="layout-menu-tooltip">
                <div class="layout-menu-tooltip-arrow"></div>
                <div class="layout-menu-tooltip-text">{{child.label}}</div>
            </div>
            <div class="submenu-arrow" *ngIf="child.items"></div>
            <ul app-submenu [item]="child" [level]="level + 1" *ngIf="child.items && level < 2"
                [ngClass]="[
                    isNumber(level) ? 'submenu-level-' + (level + 1) : ''
                ]"
                [hidden]="child.routerLink && child.routerLink !== '#'"
                (onTogglePin)="togglePin($event)"
                [pinnedMenuIds]="pinnedMenuIds"
                [visible]="isActive(i, child)" [reset]="reset" [parentActive]="isActive(i, child)"
                [@children]="((app.isSlim()|| app.isHorizontal()) && root ? (isActive(i, child) ? 'visible' : 'hidden') : isActive(i, child)) ? 'visibleAnimated' : 'hiddenAnimated'">
            </ul>
        </li>
    </ng-template>
    `,
    animations: [
        trigger('children', [
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                display: 'block'
            })),
            state('hidden', style({
                display: 'none'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})

export class AppSubMenuComponent {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;
    @Input() parentItem: MenuItem;

    _reset: boolean;

    _parentActive: boolean;

    activeIndex: number;

    permissionType: PermissionTypes = PermissionTypes.PAGE;

    isFirstLoad = true;

    @Input() level: number;

    // danh sách id của các menu item được ghim
    @Input()
    pinnedMenuIds: number[];

    @Output()
    onTogglePin = new EventEmitter();

    constructor(public app: AppComponent, private _router: Router) { }

    itemClick(event: Event, item: MenuItem, index: number) {
        this.isFirstLoad = false;
        if (this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }

        // avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        this.activeIndex = (this.activeIndex === index) ? null : index;

        // execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            setTimeout(() => {
                this.app.layoutMenuScrollerViewChild.moveBar();
            }, 450);
            event.preventDefault();
        }

        // hide menu
        if (!item.items) {
            if (this.app.isHorizontal() || this.app.isSlim()) {
                this.app.resetMenu = true;
            } else {
                this.app.resetMenu = false;
            }

            this.app.overlayMenuActive = false;
            this.app.staticMenuMobileActive = false;
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }

        if (item.url || item.routerLink) {
            this.activeIndex = null;
            this.isFirstLoad = true;
        }
    }

    onMouseEnter(index: number) {
        if (this.root && this.app.menuHoverActive && (this.app.isHorizontal() || this.app.isSlim())
            && !this.app.isMobile() && !this.app.isTablet()) {
            this.activeIndex = index;
        }
    }

    isActive(index: number, currentItem: any): boolean {
        if (!this.isFirstLoad) { return this.activeIndex == index; }

        if (currentItem && currentItem.routerLink) {
            if (this.isSameWithCurrentPageURL(currentItem.routerLink)) {
                this.activeIndex = index;
                return true;
            }
        }

        if (currentItem && currentItem.items) {
            for (const i in currentItem.items) {
                const childItem = currentItem.items[i];
                if (this.isActive(index, childItem)) {
                    return true;
                }
            }
        }

        return false;
    }

    private isSameWithCurrentPageURL(routerLink): boolean {
        const currentUrl = this._router.url;

        if (routerLink === currentUrl) {
            return true;
        }

        let currentUrlWithoutParam = currentUrl;

        if (currentUrlWithoutParam.includes('?')) {
            currentUrlWithoutParam = currentUrlWithoutParam.substr(0, currentUrlWithoutParam.indexOf('?'));
        }

        currentUrlWithoutParam = currentUrlWithoutParam.replace(/\d+/g, (str) => '--');

        return currentUrlWithoutParam === routerLink;
    }

    isNumber(element: any): boolean {
        return !isNaN(element);
    }

    togglePin(id) {
        this.onTogglePin.emit(id);
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val: boolean) {
        this._reset = val;

        if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
            this.activeIndex = null;
        }
    }

    @Input() get parentActive(): boolean {
        return this._parentActive;
    }

    set parentActive(val: boolean) {
        this._parentActive = val;

        if (!this._parentActive) {
            this.activeIndex = null;
        }
    }
}
