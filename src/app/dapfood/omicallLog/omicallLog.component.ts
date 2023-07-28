import { CustomerInfoComponent } from './../cskh/customer-info/customer-info.component';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { UserService } from './../../lib-shared/services/user.service';
import { OmiCallLogsService } from './../services/OmiCallLogs.service';
import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { OmiCallsService } from '../../lib-shared/services/omicall.service';
import { OrderClientEditComponent } from '../doanh-nghiep/order-client/order-client-edit/order-client-edit.component';

declare var omiSDK: any;
@Component({
  selector: 'app-omicallLog',
  templateUrl: './omicallLog.component.html',
  styleUrls: ['./omicallLog.component.scss']
})
export class OmicallLogComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    direction: '',
    endCause: '',
    sipUser: 0,
    fromDate: '',
    toDate: '',
    key: ''
  };
  direction_options: any[];
  endCause_options: any[];
  sipUser_options: any[];
  vi: any;
  ref: DynamicDialogRef;

  @ViewChild(OrderClientEditComponent) _orderEdit: OrderClientEditComponent;

  constructor(
    protected _injector: Injector,
    private _omicallLogsService: OmiCallLogsService,
    private _userService: UserService,
    private _configurationService: ConfigurationService,
    private _omiCallsService: OmiCallsService,
    public dialogService: DialogService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.vi = this._configurationService.calendarVietnamese;

    this.loadTableColumnConfig();
    await this.loadDirectionOptions();
    await this.loadEndCauseOptions();
    await this.loadSipUser();
    await this.getData();
  }

  loadTableColumnConfig() {
    this.cols = [
      {
        field: 'directionTxt',
        header: 'Loại cuộc gọi',
        visible: true,
        sort: false,
        width: '10%'
      },
      {
        field: 'endCause',
        header: 'Trạng thái',
        visible: true,
        sort: true,
        // width: '5%'
      },
      {
        field: 'durationTxt',
        header: 'Thời lượng nghe',
        align: 'center',
        visible: false,
        sort: true,
        width: '5%'
      },
      {
        field: 'ringingTxt',
        header: 'Thời lượng chuông',
        align: 'center',
        visible: false,
        sort: false,
        width: '5%'
      },
      {
        field: 'customer',
        header: 'Khách hàng',
        visible: true,
        sort: false,
        width: '10%'
      },
      {
        field: 'phone',
        header: 'Điện thoại',
        align: 'center',
        visible: true,
        sort: false,
        width: '8%'
      },
      // {
      //   field: 'sipNumber',
      //   header: 'Tổng đài',
      //   visible: true,
      //   sort: false,
      //   width: '5%',
      //   align: 'center'
      // },
      {
        field: 'userSip',
        header: 'Nhân viên',
        visible: true,
        sort: false,
        width: '10%'
      },
      {
        field: 'callTransactions',
        header: 'File ghi âm',
        visible: true,
        sort: false,
        //width: '25%'
      },
      {
        field: 'userDataStr',
        header: 'Liên kết',
        visible: true,
        sort: false,
        width: '5%',
        align: 'center',
      },
      {
        field: 'note',
        header: 'Ghi chú',
        visible: true,
        sort: true,
        width: '13%'
      },
      {
        field: 'startTime',
        header: 'Thời gian bắt đầu',
        visible: false,
        sort: false,
        width: '7%'
      },
      {
        field: 'endTime',
        header: 'Thời gian kết thúc',
        visible: false,
        sort: false,
        width: '7%'
      },
      {
        field: 'callOutPrice',
        header: 'Tổng tiền gọi',
        visible: true,
        sort: true,
        dataType: 'number',
        width: '10%',
        align: 'right'
      },

      // {
      //   field: 'startTime',
      //   header: 'Thời gian bắt đầu',
      //   visible: true,
      //   align: 'center',
      //   sort: false,
      //   width: '7%'
      // },
      // {
      //   field: 'endTime',
      //   header: 'Thời gian kết thúc',
      //   visible: true,
      //   sort: false,
      //   width: '7%'
      // },
    ];
  }

  async loadDirectionOptions() {
    this.direction_options = [{ label: '-- Loại cuộc gọi --', value: "" }];
    this.direction_options.push({ label: 'Cuộc gọi đi', value: "outbound" });
    this.direction_options.push({ label: 'Cuộc gọi đến', value: "inbound" });
  }

  async loadEndCauseOptions() {
    this.endCause_options = [{ label: '-- Nguyên nhân kết thúc --', value: "" }];
    this.endCause_options.push({ label: 'Máy bận', value: "BUSY" });
    this.endCause_options.push({ label: 'Hết thời gian đổ chuông', value: "NO_ANSWER" });
    this.endCause_options.push({ label: 'Số điện thoại chưa gọi vào số tổng tài', value: "TRIAL_REJECTION" });
    this.endCause_options.push({ label: 'Quá thời lượng cho phép gọi ra', value: "LIMITATION_DECLINE" });
    this.endCause_options.push({ label: 'Cuộc gọi đạt giới hạn thời lượng', value: "ALLOTTED_TIMEOUT" });
    this.endCause_options.push({ label: 'Cuộc gọi không thành công', value: "CANCEL" });
    this.endCause_options.push({ label: 'Cuộc gọi thành công', value: "BYE" });
  }

  async loadSipUser() {
    this.sipUser_options = [{ label: '-- Nhân viên --', value: 0 }];
    await this._userService.GetListUserSip().then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.sipUser_options.push({ label: value.name, value: value.omiCallSipUser });
        });
      }
    });
  }

  async getData() {
    var _startTime = new Date(this.searchModel.fromDate);
    var _endTime = new Date(this.searchModel.toDate);
    this.isLoading = true;
    this.dataSource = [];
    await this._omicallLogsService.Gets(
      this.searchModel.key,
      this.searchModel.direction,
      this.searchModel.endCause,
      this.searchModel.sipUser,
      _startTime.getTime(),
      _endTime.getTime(),
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
      this.isAsc
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        this.total = rs.totalRecord;
        this.dataTotal = [rs.dataTotal];
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }

  onSearch() {
    this.getData();
  }

  toggleSearch() {
    super.toggleSearch();
    this.fixTableScrollProblem();
  }
  onChangeRowLimit() {
    this.getData();
    this.fixTableScrollProblem();
  }
  // fix vụ lệch header ở table khi xuất hiện thanh scroll
  fixTableScrollProblem() {
    this.dataSource = [...this.dataSource];
  }
  // onCloseForm() {
  //   this.getData();
  // }


  onOmicalllog(item: any) {
    this._omiCallsService.UpdateCallTransactionsById(item.uuid).then(omicallresponse => {
      if (omicallresponse.status) {
        this.getData();
        this._notifierService.showSuccess('Đồng bộ log Call Transaction thành công!');
      }
      else {
        this._notifierService.showError(omicallresponse.message);
      }
    });

    this.resetBulkSelect();
  }

  SynMultiLogsOmicall() {
    if (this.dataSource.filter(d => d.checked == true).length <= 0) {
      this._notifierService.showError("Chọn log cuộc gọi để đồng bộ !");
      return false;
    }
    // console.log("du lieu chọn dong bo -" + JSON.stringify(this.dataSource.filter(d => d.checked == true)));
    this._omiCallsService.MultiUpdateCallTransactions(this.dataSource.filter(d => d.checked == true)).then(omicallresponse => {
      if (omicallresponse.status) {
        this.getData();
        this._notifierService.showSuccess('Đồng bộ log Call Transaction thành công!');
      }
      else {
        this._notifierService.showError(omicallresponse.message);
      }
    });

    this.resetBulkSelect();
  }

  onShowLink(strId: any) {
    if (strId.includes('orderid_')) {
      let id = strId.replace("orderid_", "");
      this._orderEdit.showPopup(id);
    }
    else if (strId.includes('UserId_')) {
      let id = strId.replace("UserId_", "");

      this.onShowDetailUserCurr(id);
    }

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

  getLinkCall(strId: string): string {
    if (strId.includes('orderid_')) {
      let id = strId.replace("orderid_", "");
      return 'Đơn hàng ' + id;
    }
    else if (strId.includes('UserId_')) {
      let id = strId.replace("UserId_", "");
      return 'Khách hàng ' + id;
    }
  }

  getAvatar(id) {
    if (id) {
      return this.getImageAvatar(id);
    }
    else {
      return `/assets/images/avatar.jpg`;
    }
  }

  callOmiCall(item) {
    if (item.callTransactions != null) {
      let userdata = item.callTransactions.userDataStr
      omiSDK.makeCall(item.phone, { datas: { 'User-Data': userdata } });
    }
    else {
      omiSDK.makeCall(item.phone, { datas: { 'User-Data': "phone_" + item.phone } });
    }
  }
}
