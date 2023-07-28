import { async } from '@angular/core/testing';
import { EventEmitterService } from './../../services/eventemitter.service';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { UserService } from './../../lib-shared/services/user.service';
import { AfterViewChecked, ElementRef, Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { environment } from '../../../environments/environment';
import { ChatsService } from '../services/Chats.service';
import { Title } from "@angular/platform-browser";
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { ClientsService } from '../services/clients.service';
import { ActivatedRoute } from '@angular/router';
declare var omiSDK: any;
@Component({
  selector: 'app-cskh',
  templateUrl: './cskh.component.html',
  styleUrls: ['./cskh.component.scss']
})
export class CskhComponent extends SecondPageIndexBase implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('textChat') private myTextAreaContainer: ElementRef;
  @ViewChild('scrollChatTopic') private myScrollChatTopicContainer: ElementRef;
  vi: any;

  // userId: number;
  chatTopics: any;
  chats: any = {
    listMessage: [],
    customer: {},
    order: {}
  };

  customerIdCurrent: number;
  receiverIdCurr: number;
  idOrderCurr: number;
  idChatCurr: number = 0;
  message: "";
  chatTopicFilter = "";
  totalMessNotReaded = 0;
  titleChange = false;
  interval: any;
  scrollBottomChat: boolean = false

  apiUrl = `${this._configurationService.apiFsFile}/Image?folderId=23`;
  maxFileSize = 1000000;
  dinhDangFile = 'image/*';
  uploadedFiles: any[] = [];
  files = [];
  imageMess: string = "";
  hideBtnCloseFilter = true;
  userCurr: any;
  userCurrentId: number;
  listUserClient: any;
  ref: DynamicDialogRef;
  totalRecordChat: number = 0;
  pageChatCurr: number = 1;
  pageTopicCurr: number = 1;
  totalRecordTopic: number = 0;
  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    private _configurationService: ConfigurationService,
    private _EventEmitterService: EventEmitterService,
    private _chatsService: ChatsService,
    public dialogService: DialogService,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
    // private _chatTopicsService: ChatTopicsService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.vi = this._configurationService.calendarVietnamese;
    this.userCurr = await this._userService.getCurrentUser();

    await this.getChatTopics();

    await this.activatedRoute.params.subscribe(async params => {
      if (params['id'] !== undefined)
        this.userCurrentId = parseInt(params['id']);
      else
        this.userCurrentId = this.chatTopics[0].customerId;

      await this.getByCustomerId(this.userCurrentId);
    });

    await this.CheckReadedChats();
    this.getFullUserClient();

    this._EventEmitterService.chat.subscribe(item => this.notifyTrigger(item));
  }

  notifyTrigger(data: any) {
    if (data.type === 1) {
    } else if (data.type === 4) {
      let obj = JSON.parse(data.data.object);
      let userCreated = this.listUserClient.filter(x => x.userId == obj.createdUserId);

      if (this.customerIdCurrent == obj.customerId) {
        if (userCreated.length > 0)
          this.chats.listMessage.push({ ...obj, avatar: userCreated[0].avatar, name: userCreated[0].name });
        else
          this.chats.listMessage.push(obj);
      }

      let index = this.chatTopics.findIndex(s => s.customerId == obj.customerId)
      if (index < 0) {
        this._chatsService.GetTopic(obj.customerId, 0, 1000).then(res => {
          if (res.status) {
            this.chatTopics.unshift(res.data[0]);
          }
          else {
            this._notifierService.showError(res.message);
          }
        })
      }
      else {
        let chatTopic = this.chatTopics[index];
        chatTopic.createdDate = obj.createdDate;

        if (obj.customerId == this.customerIdCurrent) {
          this.CheckReadedChats();
        }
        else {
          chatTopic.countNotRead += 1;
          this.totalMessNotReaded += 1;
          if (this.totalMessNotReaded > 0) {
            this.setTitlePageNoti();
          }
          else {
            this.setTitleDefault();
          }
        }

        this.chatTopics.splice(index, 1);
        this.chatTopics.unshift(chatTopic);
      }
      // if (data.data) {
      //   if (data.data.topic)
      //     this._signalRService.subscribeViewCode(data.data.topic, this.notifyTrigger.bind(this));
      // }
    }
  }

  ngAfterViewChecked() {
    // this.scrollToBottom();
    this.reSize(this.myTextAreaContainer.nativeElement);
  }

  // scrollToBottom(): void {
  //   if (!this.scrollBottomChat) {
  //     this.scrollBottomChat = true
  //     try {
  //       this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  //     } catch (err) { }
  //   }
  // }

  sendMess() {
    if ((this.message != null && this.message.trim().length > 0) || this.imageMess) {
      this.SaveChat({
        id: this.idChatCurr,
        customerId: this.customerIdCurrent,
        idOrder: this.idOrderCurr,
        message: this.message != null ? this.message.trim() : "",
        images: this.imageMess,
        idStatus: 1
      });
    }

    if (this.idChatCurr > 0) this.idChatCurr = 0;
    // this._signalRService.SendDataWeb(
    //   "sendMessageHub",
    //   ['SendMessage'],
    //   {
    //     userIdCreate: this.userId,
    //     message: "Khánh Test",
    //     userIDReceiver: 1,
    //     imagesMessage: ""
    //   }
    // )
  }

  reSize(element: any) {
    element.style.height = 0;
    element.style.height = (element.scrollHeight) + 'px';
    element.style.maxHeight = '104px';
  }

  async getByCustomerId(customerId: number) {
    // await this._chatsService.GetByCustomerId(CustomerId, 0, 15, false).then(res => {
    await this._chatsService.GetByCustomerIdByAdmin(customerId, 0, 1000, true).then(res => {
      if (res.status) {
        this.chats = res.data;
        this.totalRecordChat = res.totalRecord;
        this.customerIdCurrent = customerId;
        this.scrollBottomChat = false;
        this.totalMessNotReaded = 0;
        if (this.totalMessNotReaded > 0) {
          this.setTitlePageNoti();
        }
        else {
          this.setTitleDefault();
        }
      }
      else {
        this._notifierService.showError(res.message);
      }
    })
  }

  async getChatTopics() {
    await this._chatsService.GetTopic(this.chatTopicFilter, 0, 15).then(res => {
      if (res.status) {
        this.chatTopics = res.data;
        this.totalRecordTopic = res.totalRecord;
        if (this.chatTopics.length > 0) {
          this.chatTopics.forEach(item => {
            this.totalMessNotReaded += item.countNotRead
          })
        }
        if (this.totalMessNotReaded > 0) {
          this.setTitlePageNoti();
        }
        else {
          this.setTitleDefault();
        }

      }
      else {
        this._notifierService.showError(res.message);
      }
    })
  }

  SaveChat(formChat: any) {
    this.chats.listMessage.push({
      avatarUserCreated: this.userCurr.avatar,
      chatTopicId: 1,
      createdDate: new Date().getTime() + 25200000,
      createdUserId: this.userCurr.userId,
      customerId: this.customerIdCurrent,
      deletedDate: null,
      deletedUserId: null,
      name: this.userCurr.name,
      id: 0,
      idOrder: null,
      idStatus: 1,
      images: this.imageMess,
      isDeleted: false,
      isReaded: false,
      message: this.message,
      updatedDate: null,
      updatedUserId: null,
      userId: this.userCurr.userId
    });
    this.message = "";
    this.imageMess = "";
    this.reSize(this.myTextAreaContainer.nativeElement);
    this._chatsService.SaveByCSKH(formChat).then(res => {
      if (res.status) {
        if (formChat.id > 0) {
          let index = this.chats.listMessage.findIndex(x => x.id == formChat.id);
          this.chats.listMessage[index].message = this.message;
        }
        // else {
        //   this.chats.listMessage.push(res.data);
        // }
        // this.getChatTopics();
      }
    })
  }

  updateChat(IdChat: number) {
    this._chatsService.GetByChatId(IdChat).then(res => {
      if (res.status) {
        this.message = res.data.message;
        this.idChatCurr = res.data.id;
        // this.getChatTopics();
      }
    })
  }

  async CheckReadedChats() {
    await this._chatsService.UpdateReaded(this.customerIdCurrent).then(res => {
      if (res.status) {
        let index = this.chatTopics.findIndex(x => x.customerId == this.customerIdCurrent);
        this.chatTopics[index].countNotRead = 0;

        this.mySetting.totalMessNotReaded = this.chatTopics.map(s => s.countNotRead).reduce((total, num) => total + num);
        this._mySettingService.setCurrentSetting(this.mySetting);
        this._EventEmitterService.updateCountIconMessageChat.emit(this.mySetting);
      }
      else {
        this._notifierService.showError(res.message);
      }
    })
  }

  setTitlePageNoti() {
    this.titleChange = false;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      // if (this.totalMessNotReaded > 0) {

      if (this.titleChange) {
        this.titleService.setTitle(`Tin nhắn mới (${this.totalMessNotReaded})`);
      }
      else {
        this.titleService.setTitle("BAPI");
      }
      this.titleChange = !this.titleChange;

      // }
      // else {
      //   clearInterval(this.interval);
      //   this.titleService.setTitle("BAPI");
      // }
    }, 1000)

  }

  setTitleDefault() {
    for (let i = 1; i < 10000; i++) {
      clearInterval(i);
    }
    this.titleService.setTitle("BAPI");
  }

  onUploadEvent(event: any) {
    try {
      const files = event.files;
      if (files.length > 0) {
        const responseJson = event.originalEvent;
        if (responseJson.body) {
          if (responseJson.body.status) {
            const filesResponse = responseJson.body.data;
            if (this.imageMess.length > 1) {
              this.imageMess += ",";
            }
            for (const file of filesResponse) {
              if (file == filesResponse[filesResponse.length - 1]) {

                this.imageMess += file.id;
              }
              else {
                this.imageMess += file.id + ",";
              }
            }
          }
        }
      }
    } catch (e) {
      // console.log(e);
      console.error(e);
    }
  }

  onClickImageUpload() {
    var btnImage: HTMLElement = document.getElementsByClassName('ui-fileupload-choose')[0].getElementsByClassName("ng-star-inserted")[0] as HTMLElement;;
    btnImage.click();
  }

  imageArray() {
    return this.imageMess.split(",");
  }

  deleteItemImg(image: string) {
    let imageArr = this.imageMess.split(",");
    this.imageMess = "";
    let index = imageArr.findIndex(x => x == image);
    imageArr.splice(index, 1);
    for (const image of imageArr) {
      if (image == imageArr[imageArr.length - 1]) {
        this.imageMess += image;
      }
      else {
        this.imageMess += image + ",";
      }
    }
  }

  onError(ev) { }

  onProgress(event) {
    // if (event.originalEvent.loaded !== 0) {
    //     this.isUploading = true;
    //     this.progressValue = (event.originalEvent.loaded / event.originalEvent.total) * 100;
    // }
    // if (event.originalEvent.loaded === 100) {
    //     this.isUploading = false;
    // }
  }

  // onOpenBtnCloseFilter() {
  //   this.hideBtnCloseFilter = false;
  // }

  onDeleteFilterCus() {
    if (this.chatTopicFilter != null && this.chatTopicFilter.length > 0) {
      this.chatTopicFilter = "";
      this.getChatTopics();
    }
    this.hideBtnCloseFilter = true;
  }

  changeStatusBtnFilterCLose() {
    if (this.chatTopicFilter != null && this.chatTopicFilter.length > 0) {
      this.hideBtnCloseFilter = false;
    }
    // else {
    //   this.hideBtnCloseFilter = true;
    // }
  }

  callOmiCall(item) {
    omiSDK.makeCall(item.phone, { datas: { 'User-Data': "UserId_" + item.userId } });
  }

  onShowDetailUserCurr(id) {
    this.ref = this.dialogService.open(CustomerInfoComponent, {
      data: {
        userId: id
      },
      header: 'Thông tin khách hàng',
      width: '95%',
      height: 'calc(100vh - 100px)',
      styleClass: "vs-modal",
      contentStyle: { 'overflow': 'auto' }, //'max-height': 'calc(100vh - 180px);', 
      baseZIndex: 1001,
      closeOnEscape: true
    });

    this.ref.onClose.subscribe((re: any) => {
      if (re != null) {
        this.isLoading = false;
      }
    });
  }

  async getFullUserClient() {
    await this._userService.getUsersByIdClient(this.userCurr.idClient).then(rs => {
      if (rs.status) {
        this.listUserClient = rs.data;
      }
    });
  }

  getAvatar(userId) {
    if (this.listUserClient != null && this.listUserClient.length > 0) {
      let list = this.listUserClient.filter(x => x.userId == userId);
      if (list.length > 0 && list[0].avatar != null)
        return this.getImageAvatar(list[0].avatar);
      else
        return `/assets/images/avatar.jpg`;
    }
  }

  getAvatarUser(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/avatar.jpg`;
  }

  async scrollMess() {
    let divScroll = this.myScrollContainer.nativeElement;
    // console.log("divScroll.scrollTop: ", divScroll.scrollTop);
    // console.log("divScroll.clientHeight: ", divScroll.clientHeight);
    // console.log("divScroll.scrollHeight: ", divScroll.scrollHeight);
    if (divScroll.scrollTop == 0) {
      if (this.pageChatCurr < Math.ceil(this.totalRecordChat / 15)) {
        this.pageChatCurr += 1;
        await this._chatsService.GetByCustomerIdByAdmin(this.customerIdCurrent, (this.pageChatCurr - 1) * 15, 15, false).then(res => {
          if (res.status) {
            this.chats.listMessage = [...res.data.listMessage, ...this.chats.listMessage];
            this.totalRecordChat = res.totalRecord;
            this.pageChatCurr = this.pageChatCurr;
            divScroll.scrollTop = 800;
          }
          else {
            this._notifierService.showError(res.message);
          }
        });
      }
    }
  }

  async scrollTopic() {
    let divScroll = this.myScrollChatTopicContainer.nativeElement;
    if (divScroll.scrollTop + divScroll.clientHeight >= divScroll.scrollHeight) {
      if (this.pageTopicCurr < Math.ceil(this.totalRecordTopic / 15)) {
        this.pageTopicCurr += 1;
        await this._chatsService.GetTopic(this.chatTopicFilter, (this.pageTopicCurr - 1) * 15, 15).then(res => {
          if (res.status) {
            this.chatTopics = [...this.chatTopics, ...res.data];
            this.totalRecordTopic = res.totalRecord;
            this.pageTopicCurr = this.pageTopicCurr
          }
          else {
            this._notifierService.showError(res.message);
          }
        })
      }

    }
  }

  // async scrollTopMess() {
  //   if (!this.scrollBottomChat) {
  //     this.scrollBottomChat = !this.scrollBottomChat;
  //     return this.myScrollChatTopicContainer.nativeElement.scrollHeight;
  //   }
  //   else {
  //     this.myScrollChatTopicContainer.nativeElement.scrollTop
  //   }
  // }
}

