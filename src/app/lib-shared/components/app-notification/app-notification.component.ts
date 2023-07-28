import { EventEmitterService } from './../../../services/eventemitter.service';
import {
    Component,
    OnInit,
    HostListener,
    ViewChild,
    Output,
    EventEmitter
} from "@angular/core";
import { SignalRService } from "../../services/signalr.service";
import { Router } from "@angular/router";
import { environment } from '../../../../environments/environment';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { ComponentBase } from '../../classes/base/component-base';
import * as moment from 'moment';

@Component({
    // tslint:disable-next-line:component-selector
    selector: "li[vs-app-notification]",
    templateUrl: "./app-notification.component.html",
    styleUrls: ["./app-notification.component.css"],
    providers: [SignalRService]
})
export class VsAppNotificationComponent extends ComponentBase implements OnInit {
    maxNotification = 10;
    totalUnRead = 0;
    data = [];
    elViewNotificationNavInside: HTMLElement;

    url = "";
    urldetail = "";
    notifications = [];

    userId: number;
    currentItem: any;


    pageIndex = 0;
    pageSize = 10;
    infiniteScrollThrottle = 150;
    infiniteScrollDistance = 2;
    direction = '';
    topic = ['friends'];
    @ViewChild("notificationdetail") notificationDetail: any;

    @Output("openMenu") openMenu: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private _signalRService: SignalRService,
        private _userService: UserService,
        private _notificationService: NotificationService,
        private _EventEmitterService: EventEmitterService,
        private _router: Router
    ) {
        super();
    }

    ngOnInit() {
        this.userId = this._userService.getBasicUserInfo().userId;
        this.topic.push(this.userId.toString());
        let ra = this._userService.getBasicUserInfo().roleassign;
        if (ra) {
            let roleassign = JSON.parse(ra);
            roleassign.forEach(element => {
                this.topic.push('role_' + element.toLowerCase());
            });
        }

        this._EventEmitterService.notification.subscribe(item => this.notifyTrigger(item));
        this.refreshNotification();
    }

    notifyTrigger(data: any) {
        if (data.type === 1) {
            this.notifications.unshift(data);

            // if (this.notifications.length > this.maxNotification) {
            //     this.notifications.pop();
            // }

            this.totalUnRead++;
        } else if (data.type === 3) {
            if (data.data) {
                if (data.data.topic)
                    this._signalRService.subscribeViewCode(data.data.topic, this.notifyTrigger.bind(this));
            }
        }
    }

    refreshNotification() {
        this._notificationService.getsByUserId()
            .then(result => {
                this.notifications = result.data;
                this.totalUnRead = result.totalRecord;
            });
    }

    onScrollDown() {
        this.pageIndex += 1;
        this.direction = 'down';
        this.addItems()
    }

    addItems() {
        this._notificationService.getsByUserId(this.pageIndex * this.pageSize)
            .then(result => {
                result.data.forEach(element => {
                    this.notifications.push(element);
                });

                this.totalUnRead = result.totalRecord;
            });
    }

    readAll(event) {
        event.preventDefault();
        event.stopPropagation();

        this._notificationService.readAll().then(rs => {
            this.notifications.forEach(element => {
                if (element.read != null) {
                    element.read.push({ userId: this.userId });
                } else {
                    element.read = [{ userId: this.userId }];
                }
            });
        });

        this.totalUnRead = 0;
    }

    readById(data: any) {
        this._notificationService.read(data.id).then(rs => {
            if (data.read != null) {
                data.read.push({ userId: this.userId });
            } else {
                data.read = [{ userId: this.userId }];
            }
        });
    }

    getClassRead(item: any): string {
        let classRead = "un-read";
        if (item.read != null) {
            item.read.forEach(x => {
                if (x.userId.toString() === this.userId.toString()) {
                    classRead = "";
                }
            });
        }
        return classRead;
    }

    isReaded(item: any): boolean {
        if (item.read != null) {
            item.read.forEach(x => {
                if (x.userId.toString() === this.userId.toString()) {
                    return true;
                }
            });
        }
        return false;
    }

    goToLink(item: any) {
        if (!this.isReaded(item)) {
            this.readById(item);
            this.totalUnRead--;
        }

        const link = item.message.link;
        if (!link)
            return;
        let rawLink = "";
        let queryString = {};
        let hash = "";

        if (link.indexOf("?") > -1) {
            const linkArr = link.split("?");
            rawLink = linkArr[0];

            if (linkArr[0].indexOf("#") > -1) {
                const linkArrHash = linkArr[0].split("#");

                queryString = linkArrHash[0];
                hash = linkArrHash[1];
            } else {
                queryString = linkArr[0];
            }
        } else {
            if (link.indexOf("#") > -1) {
                const linkArr = link.split("#");

                rawLink = linkArr[0];
                hash = linkArr[1];
            } else {
                rawLink = link;
            }
        }

        rawLink = rawLink + '?' + moment().unix()        //  (new Date().getUTCMilliseconds());    // Hoặc dùng moment().valueOf()      moment().unix()

        this._router.navigate([rawLink], {
            queryParams: queryString,
            fragment: hash,
        });
    }

    headerClick(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    openMenuEvent($event) {
        this.openMenu.next($event);
        this._notificationService.viewAll();
        this.totalUnRead = 0;
    }
}
