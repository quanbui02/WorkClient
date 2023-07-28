import { Directive, ElementRef, Input, OnInit, AfterContentChecked } from '@angular/core';
import { AuthorizeService } from '../services/authorize.service';
import { PermissionTypes } from '../vs-constants';
import { UserService } from '../services/user.service';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[authorize]'
})
export class AuthorizeDirective implements OnInit, AfterContentChecked {
    protected _permissionRequired: any;
    protected _element: HTMLElement;
    protected _label: HTMLElement;
    protected _bind: boolean;
    protected _permissionTypes: PermissionTypes = PermissionTypes.CONTROL;

    @Input() set authorize(value: any) {
        this._permissionRequired = value;
    }

    @Input() set permissionType(value: any) {
        this._permissionTypes = value;
    }

    @Input() isNavigationPermission = false;

    // tslint:disable-next-line:no-input-rename
    @Input('key') authorizeKey: string;
    @Input('keepHTML') keepHTML: boolean;

    constructor(private _el: ElementRef,
        private _authorizeService: AuthorizeService,
        private _userService: UserService) {
        this._element = _el.nativeElement;
    }

    ngOnInit(): void {
        if (this._userService.getBasicUserInfo().issuperuser)
            return;


        // Xử lý riêng cho trường hợp navigation
        if (this._permissionRequired && this.isNavigationPermission) {
            if (this._permissionRequired instanceof Array) {
                for (let i = 0; i < this._permissionRequired.length; i++) {
                    if (this._permissionRequired[i]) {
                        this._permissionRequired[i] = JSON.parse(this._permissionRequired[i].replace(/'/g, '"'));
                    }
                }
            } else {
                this._permissionRequired = JSON.parse(this._permissionRequired.toString().replace(/'/g, '"'));
            }
        }

        if ((this._permissionRequired instanceof String || typeof this._permissionRequired === 'string') && !this.isNavigationPermission) {
            const inheritedElement: Element = document.querySelector(`[key="${this._permissionRequired}"]`);

            if (inheritedElement == null) {
                if (this.keepHTML) {
                    this._label = document.createElement('span');

                    if (this._element.parentElement) {
                        this._element.parentElement.appendChild(this._label);
                        this._element.remove();
                    }
                } else {
                    this._element.remove();
                }
            }
        } else if (this._permissionRequired instanceof Array) {
            let isUnValidated = false;
            for (const item of this._permissionRequired) {
                if (this._authorizeService.validated(item, this._permissionTypes)) {
                    isUnValidated = true;
                    break;
                }
            }

            if (!isUnValidated) {
                if (this.keepHTML) {
                    this._label = document.createElement('span');

                    if (this._element.parentElement) {
                        this._element.parentElement.appendChild(this._label);
                        this._element.remove();
                    }
                } else {
                    this._element.remove();
                }
            }

        } else if (this._permissionRequired instanceof Object || this.isNavigationPermission) {
            if (!this._authorizeService.validated(this._permissionRequired, this._permissionTypes)) {
                if (this.keepHTML) {
                    this._label = document.createElement('span');

                    if (this._element.parentElement) {
                        this._element.parentElement.appendChild(this._label);
                        this._element.remove();
                    }
                } else {
                    this._element.remove();
                }
            }
        }
    }

    ngAfterContentChecked() {
        if (this._label && !this._bind && this._element.innerHTML !== '' && this.keepHTML) {
            this._label.innerHTML = this._element.innerHTML;
            this._bind = true;
        }
    }
}
