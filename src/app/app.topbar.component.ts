import { Title } from '@angular/platform-browser';
import { OrderGiftsService } from './dapfood/services/ordergift.service';
import { Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs';
import { GlobalService } from './services/global.service';
import { VsMySettingService } from './services/ccmysetting.service';
import { VsMySetting } from './models/ccmysetting';
import { CustomRouterService } from './lib-shared/services/custom-router.service';
import { NotifierService } from './lib-shared/services/notifier.service';
import { CommonService } from './lib-shared/services/common.service';
import { User } from './lib-shared/models/user';
import { UserService } from './lib-shared/services/user.service';
import { StatementsService } from './dapfood/services/statements.service';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import 'rxjs/add/operator/toPromise';
import { SignalRService } from './lib-shared/services/signalr.service';
import { OmiCallsService } from './lib-shared/services/omicall.service';
import { EventEmitterService } from './services/eventemitter.service';

declare var omiSDK: any;


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss']
})
export class AppTopBarComponent implements OnInit, OnDestroy, AfterViewInit {
    environment = environment;
    searchKey = '';

    _unSubscribeAll = new Subject<any>();
    _sub: Subscription;
    currentRoute = '';
    fileApi = '';

    position = '';
    avatarUrl = 'assets/images/avatar.jpg';
    crrUser: User;
    display: any;
    mySetting = new VsMySetting();
    mySettingEdit = new VsMySetting();
    formGroup = [];
    balance = 0;
    balanceBlock = 0;
    items: Observable<any[]>;
    list: Array<any>;
    citiesRef: Array<any>;
    docRef: any;
    CallTransactions: {
        TransactionId: string
    }
    titleChange = false;
    interval: any;

    @Output() vsclosePopup = new EventEmitter<any>();

    constructor(
        public app: AppComponent,
        private _activatedRoute: ActivatedRoute,
        private _customRouteService: CustomRouterService,
        private _StatementsService: StatementsService,
        private _router: Router,
        private _userService: UserService,
        public _globalService: GlobalService,
        private _mySettingService: VsMySettingService,
        private _signalRService: SignalRService,
        public _commonService: CommonService,
        private _EventEmitterService: EventEmitterService,
        private _omiCallsService: OmiCallsService,
        private _notifierService: NotifierService,
        private titleService: Title,
    ) {
        this.fileApi = this.environment.apiDomain.fileEndpoint;
    }

    async ngOnInit() {
        this.mySetting = this._mySettingService.getCurrentSetting();
        this.crrUser = await this._userService.getCurrentUser();

        this._EventEmitterService.updateCountIconMessageChat.subscribe(item => this.mySetting = item);

        this.getImageUrl();
        this.loadSatement();
        this._signalRService.start(
            environment.signalrConfig.hub.notification,
            this.crrUser.userId.toString(),
            this.notifyTrigger.bind(this)
        );

        // omiSDK.unregister();
        /// sdk omicall
        let config = {
            theme: 'default',
            options: {
                draggable: true,
                showNoteInput: true,
                hideCallButton: true
            },
            ringtoneVolume: 0.1,
            classes: {
                dialog: 'custom-dialog-call',
            },
            styles: {
                dialog: {
                    'z-index': '9999',
                    'margin-bottom': '50px',
                },
                btnToggle: {
                    bottom: '50px',
                    right: '20px',
                }
            },
            callbacks: {
                register: (data: any) => {
                    // Sự kiện xảy ra khi trạng thái kết nối tổng đài thay đổi
                    // console.log('register:', data);
                },
                connecting: (data: any) => {
                    // Sự kiện xảy ra khi bắt đầu thực hiện cuộc gọi ra
                    // console.log('connecting:', data);
                },
                invite: (data: any) => {
                    // Sự kiện xảy ra khi có cuộc gọi tới
                    // console.log('invite:', data);
                },
                inviteRejected: (data: any) => {
                    // Sự kiện xảy ra khi có cuộc gọi tới, nhưng bị tự động từ chối
                    // trong khi đang diễn ra một cuộc gọi khác
                    // console.log('inviteRejected:', data);
                },
                ringing: (data: any) => {
                    // Sự kiện xảy ra khi cuộc gọi ra bắt đầu đổ chuông
                    // console.log('ringing:', data);
                },
                accepted: (data: any) => {
                    // Sự kiện xảy ra khi cuộc gọi vừa được chấp nhận
                    // console.log('accepted:', data);
                },
                incall: (data: any) => {
                    // Sự kiện xảy ra mỗi 1 giây sau khi cuộc gọi đã được chấp nhận
                    // console.log('incall:', data);
                },
                acceptedByOther: (data: any) => {
                    // Sự kiện dùng để kiểm tra xem cuộc gọi bị kết thúc
                    // đã được chấp nhận ở thiết bị khác hay không
                    // console.log('acceptedByOther:', data);
                },
                ended: (data: any) => {
                    // Sự kiện xảy ra khi cuộc gọi kết thúc
                    // gọi thành công xác nhận lại đơn hàng

                    var _startTime = new Date(data.startTime);
                    data.id = 0;
                    data.startTime = _startTime.toLocaleDateString('en-US') + ' ' + _startTime.toTimeString().substring(0, _startTime.toTimeString().indexOf("GMT"));
                    var _endTime = new Date(data.endTime);
                    data.endTime = _endTime.toLocaleDateString('en-US') + ' ' + _endTime.toTimeString().substring(0, _endTime.toTimeString().indexOf("GMT"));
                    //console.log('ended:', JSON.stringify(data));
                    this._omiCallsService.SaveOmiCallLogs(data).then(res => {

                        if (res.status && data.direction == 'outbound') {
                            if (Object.keys(res.data).length != 0) {
                                // console.log("res log " + JSON.stringify(res.data));
                                this._EventEmitterService.omicall.emit(res.data);
                            }
                        }
                    });
                },
                holdChanged: (status: any) => {
                    // Sự kiện xảy ra khi trạng thái giữ cuộc gọi thay đổi
                    // console.log('on hold:', status);
                },
                saveCallInfo: (data: any) => {
                    // let { callId, note, ...formData } = data;
                    // Sự kiện xảy ra khi cuộc gọi đã có đổ chuông hoặc cuộc gọi tới, khi user có nhập note input mặc định hoặc form input custom
                    // console.log('on save call info:', data);

                    if (data.callId && data.note) {
                        this._omiCallsService.UpdateNoteOmicallLog(data.callId, data.note);
                    }

                },
            }
        };
        if (this.crrUser.isOmiCall) {
            omiSDK.init(config, () => {
                omiSDK.register({
                    domain: this.crrUser.omiCallDomain,
                    username: this.crrUser.omiCallSipUser, // tương đương trường "sip_user" trong thông tin số nội bộ
                    password: this.crrUser.omiCallSecretKey
                });
            });
        }
    }

    async notifyTrigger(data: any) {
        // Notification
        if (data.type === 1) {
            this._EventEmitterService.notification.emit(data);
        }
        // Update statement (update data mà không hiển thị noti)
        if (data.type === 3) {
            if (data.data) {
                if (data.data.balance) {
                    this.loadSatement();
                }
            }
            this._EventEmitterService.event.emit(data);
        }
        // Chat
        else if (data.type === 4) {
            let obj = JSON.parse(data.data.object);

            if (this._router.url != "/cskh") {
                this._notifierService.showChat(obj.message);
            }
            else {
                this._EventEmitterService.chat.emit(data);
            }
            if (obj.customerId != this.crrUser.userId) {
                this.mySetting.totalMessNotReaded += 1;
                this.setTitlePage();
            }
            this._mySettingService.setCurrentSetting(this.mySetting);
        }
    }

    setTitlePage() {
        this.titleChange = false;
        clearInterval(this.interval);
        if (this.mySetting.totalMessNotReaded > 0) {
            this.interval = setInterval(() => {
                if (this._router.url == "/cskh") {
                    clearInterval(this.interval);
                    this.titleService.setTitle("BAPI");
                }
                if (this.titleChange) {
                    this.titleService.setTitle(`Tin nhắn mới (${this.mySetting.totalMessNotReaded})`);
                }
                else {
                    this.titleService.setTitle("BAPI");
                }
                this.titleChange = !this.titleChange;
            }, 1000)
        }
        else {
            clearInterval(this.interval);
            this.titleService.setTitle("BAPI");
        }
    }

    onMessagesClick() {
        this.mySetting.totalMessNotReaded = 0
        this._mySettingService.setCurrentSetting(this.mySetting);
    }


    getImageUrl() {
        if (this.crrUser && this.crrUser.avatar) {
            this.avatarUrl = `${environment.apiDomain.fileEndpoint}/files/image/Avatar/${this.crrUser.avatar}`; // `${this.fileApi}/files/getfile?id=${this.currentUser.avatar}`;
        } else {
            this.avatarUrl = 'assets/images/avatar.jpg';
        }
    }

    loadSatement() {
        this._StatementsService.GetBalance().then(rs => {
            if (rs.status) {
                this.balance = rs.data.balance;
                this.balanceBlock = rs.data.cashInTransit;
            }
        });
    }

    ngAfterViewInit(): void {
        // first time
        const url = top.location.href;
        if (url.indexOf('#searchKey=') > -1) {
            const obj = this._customRouteService.parseFragment(url.split('#')[1]);
            if (obj.searchKey) {
                this.searchKey = decodeURIComponent(obj.searchKey.trim());
            }
        }

        this._sub = this._router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((r: NavigationEnd) => {
            const fragment = this._customRouteService.parseFragment(location.hash.substring(1));

            if (fragment.searchKey) {
                this.searchKey = decodeURIComponent(fragment.searchKey);
            } else {
                this.searchKey = '';
            }

            this._globalService.setSearchBoxState(true);
        });
    }

    ngOnDestroy(): void {
        this._unSubscribeAll.next();
        this._unSubscribeAll.complete();
        if (this._sub) {
            this._sub.unsubscribe();
        }
    }

    onTopbarSearchClick(event, searchKey) {
        if (searchKey.value !== '') {
            this._router.navigate([location.pathname], { relativeTo: this._activatedRoute, fragment: `searchKey=${searchKey.value}` });
        } else {
            this._router.navigate([location.pathname], { relativeTo: this._activatedRoute });
        }
    }

    showDialog() {
        this.display = true;
    }

    onCloseDialog() {
        this.display = false;
    }

    onSaveSettings() {
        // const namhoc = this.namHoc_options.find(s => s.value === this.mySettingEdit.idNamHoc);
        // const hocky = this.hocKy_options.find(s => s.value === this.mySettingEdit.idHocKy);
        // const dothi = this.dotThi_options.find(s => s.value === this.mySettingEdit.idDotThi);
        // if (namhoc == null || hocky == null || dothi == null) {
        //     this.notifierService.showError('Bạn phải chọn đợt thi');
        // } else {
        // this.mySetting.idNamHoc = namhoc.value;
        // this.mySetting.idHocKy = hocky.value;
        // this.mySetting.idDotThi = dothi.value;

        // this.mySetting.tenNamHoc = namhoc.label;
        // this.mySetting.khHocKy = hocky.label;
        // this.mySetting.tenDotThi = dothi.label;
        // this._mySettingService.setCurrentSetting(this.mySetting);
        // this.notifierService.showSuccess('success', 'Lưu thiết lập thành công');
        // this.onCloseDialog();
        // window.location.reload();
        // }
    }

    onReturn() {
        // if (this.mySetting.idNamHoc == null || this.mySetting.idHocKy == null || this.mySetting.idDotThi == null) {
        //     this.notifierService.showError('Bạn chưa thiết lập đợt thi');
        //     return;
        // } else {
        //     this.onCloseDialog();
        // }
    }

}
