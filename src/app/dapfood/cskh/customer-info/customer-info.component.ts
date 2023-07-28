import { ConfigurationService } from './../../../lib-shared/services/configuration.service';
import { async } from '@angular/core/testing';
import { WardsService } from './../../services/wards.service';
import { DistrictsService } from './../../services/districts.service';
import { ProvincesService } from './../../services/provinces.service';
import { OrdersDetailShipComponent } from './../../doanh-nghiep/order-client/orders-detail-ship/orders-detail-ship.component';
import { OrderClientEditComponent } from './../../doanh-nghiep/order-client/order-client-edit/order-client-edit.component';
import { GiftsService } from './../../services/vouchers.service';
import { OrderGiftsService } from './../../services/ordergift.service';
import { NotifierService } from './../../../lib-shared/services/notifier.service';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { OmiCallLogsService } from '../../services/OmiCallLogs.service';
import { UserService } from '../../../lib-shared/services/user.service';
import { OrdersService } from '../../services/orders.service';
declare var omiSDK: any;

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    fromDate: '',
    toDate: '',
    statusType: 0,
    status: [0]
  };
  cols = [];
  userId: number = 0;
  modelEdit: any = {};
  detailCall: any = [];
  isLoading = false;
  isView = false;
  listOrder: any;
  page = 1;
  limit = 100;
  pageOmicall = 1;
  limitOmicall = 20;
  index = 0;
  vi: any;
  listItemNumberPerPage = [
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '200', value: 200 },
    { label: '500', value: 500 },
    { label: '1000', value: 1000 },
  ];
  list_statusType = [];
  total = 0;
  dataTotal = [];

  totalOmicall = 0;
  dataTotalOmicall = [];

  totals = 0;
  ships = 0;
  totalBills = 0;
  hideInfo = false;
  provinces: any;
  districts: any;
  wards: any;

  @ViewChild(OrderClientEditComponent) _orderEdit: OrderClientEditComponent;
  @ViewChild(OrdersDetailShipComponent) _OrdersDetailShip: OrdersDetailShipComponent;

  constructor(
    protected _injector: Injector,
    private _userRoleService: UserService,
    public _OmicallLogsService: OmiCallLogsService,
    private _OrdersService: OrdersService,
    private _ProvincesService: ProvincesService,
    private _DistrictsService: DistrictsService,
    private _WardsService: WardsService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private _configurationService: ConfigurationService,

  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.vi = this._configurationService.calendarVietnamese;

    this.cols = [
      {
        field: 'code',
        header: 'Mã đơn',
        visible: true,
        align: 'center',
        width: '9%',
      },
      {
        field: 'deliveryDate',
        header: 'Thời gian nhận hàng',
        visible: true,
        dataType: 'date',
        align: 'center',
        width: '10%',
      },
      {
        field: 'listNameProduct',
        header: 'Tên sản phẩm',
        visible: true,
        // width: '15%',
      },
      {
        field: 'isPrepay',
        header: 'Thanh toán',
        width: '5%',
        visible: true,
        align: 'center',
      },
      {
        field: 'shopName',
        header: 'Cửa hàng',
        visible: true,
        align: 'left',
        width: '20%',
      },
      {
        field: 'totalBill',
        header: 'Tổng tiền',
        dataType: 'number',
        visible: true,
        width: '10%',
        align: 'right'
      },
      {
        field: 'status',
        header: 'Trạng thái',
        visible: true,
        align: 'center',
        width: '10%',
      }
    ];
    this.userId = this.config.data.userId;
    await this.loadStatusType()
    this.hideInfo = false;
    await this.GetUserDetail(this.userId);
    await this.GetOmicalLogsByUserId(this.userId);
    await this.getData(this.userId);
  }

  closeAndSelected() {
    // this.isShow = false;
    // this.isLoading = false;
    this.ref.close(null);
  }

  async loadStatusType() {
    this.list_statusType = [];
    // await this._StatementsService.ThongKeDNTheoTrangThai(this.searchModel.fromDate, this.searchModel.toDate, 0).then(rs => {
    //     if (rs.status) {
    //         this.list_statusType.push({ label: 'Tất cả', value: 0, count: rs.data.filter(d => d.idStatus <= 1000).reduce((sum, current) => sum + current.count, 0) });
    //         rs.data.forEach(item => {
    //             if (item.idStatus <= 1000 && item.idStatus != 22 && item.idStatus != 40 && item.idStatus != 34 && item.idStatus != 21 && item.idStatus != 33) {
    //                 this.list_statusType.push({ label: item.name, value: item.idStatus, count: item.count });
    //             }
    //         });
    //     }
    // });

    this.list_statusType = [{ label: 'Tất cả', value: 0 }];
    this.list_statusType.push({ label: "Đã giao hàng", value: 31 });
    this.list_statusType.push({ label: "Hủy đơn", value: 999 });
  }

  // fix vụ lệch header ở table khi xuất hiện thanh scroll
  fixTableScrollProblem() {
    this.listOrder = [...this.listOrder];
  }
  fixTableScrollProblemOmicall() {
    this.detailCall = [...this.detailCall];
  }


  onChangeRowLimit() {
    this.getData(this.userId);
    this.fixTableScrollProblem();
  }
  onChangeRowLimitOmicall() {
    this.GetOmicalLogsByUserId(this.userId);
    this.fixTableScrollProblemOmicall();
  }

  async GetUserDetail(id: any) {
    this.isLoading = true;
    this.isView = true;
    await this._userRoleService.getDetail(id).then(async response => {
      this.isLoading = false;
      if (response.status) {
        this.modelEdit = response.data;
        if (this.modelEdit.idProvince) {
          await this._ProvincesService.getDetail(this.modelEdit.idProvince).then(rs => {
            if (rs.status) {
              this.modelEdit = { ...this.modelEdit, provinceName: rs.data.name }
            }
          })
        }
        if (this.modelEdit.idDistrict) {
          await this._DistrictsService.getDetail(this.modelEdit.idDistrict).then(rs => {
            if (rs.status) {
              this.modelEdit = { ...this.modelEdit, districtName: rs.data.name }
            }
          })
        }
        if (this.modelEdit.idWard) {
          await this._WardsService.getDetail(this.modelEdit.idWard).then(rs => {
            if (rs.status) {
              this.modelEdit = { ...this.modelEdit, wardName: rs.data.name }
            }
          })
        }
        // this.modelEdit.isSuperUserBool = this.modelEdit.isSuperUser();
      }
    })
  }

  async GetOmicalLogsByUserId(Userid: any) {
    this.isLoading = true;
    this.isView = true;
    await this._OmicallLogsService.GetLogByUserId(Userid, (this.pageOmicall - 1) * this.limitOmicall, this.limitOmicall).then(re => {
      this.isLoading = false;
      if (re.status) {
        this.detailCall = re.data;
        this.totalOmicall = re.totalRecord;
        this.dataTotalOmicall = [re.dataTotal];
      }
      else {
        this._notifierService.showError(re.message);
      }
    })
  }
  onPage(event: any): void {
    this.page = (event.first / event.rows) + 1;
    this.limit = event.rows;
    this.getData(this.userId);
  }
  onPageOmicall(event: any): void {
    this.pageOmicall = (event.first / event.rows) + 1;
    this.limitOmicall = event.rows;
    this.GetOmicalLogsByUserId(this.userId);
  }

  async getData(Userid: number = 0) {

    if (this.searchModel.statusType > 0) {
      this.searchModel.status = [this.searchModel.statusType];
    }

    if (this.searchModel.statusType == 0) {
      this.searchModel.status = this.searchModel.status.length > 1 ? this.searchModel.status : [];
    }

    await this._OrdersService.FindOrderByUser(Userid, this.searchModel.status, this.searchModel.fromDate, this.searchModel.toDate, (this.page - 1) * this.limit, this.limit).then(rs => {
      if (rs.status) {
        this.listOrder = rs.data;
        this.total = rs.totalRecord;
        this.dataTotal = [rs.dataTotal];
      }
    });
  }


  async onSearch() {
    this.totals = 0;
    this.ships = 0;
    this.totalBills = 0;
    this.searchModel.status = [];
    this.searchModel.status.push(this.searchModel.statusType);
    await this.getData(this.userId);
  }

  onShowPopup(id) {
    this._orderEdit.showPopup(id)
  }

  onShipDetail(codeShip) {
    this._OrdersDetailShip.showPopup(codeShip);
  }

  openCloseInfo() {
    let element = document.getElementById("user_info");
    let tabUser = document.getElementById("tab_user");
    let btnExpand = document.getElementById("btn_expand");
    if (!this.hideInfo) {
      element.classList.add("close_information");
      element.classList.add("hide_element");
      element.classList.remove("open_information");
      tabUser.classList.add("extend_tab_user");
      tabUser.classList.remove("narrow_tab_user");
      btnExpand.classList.add("btn_rotate");
    }
    else {
      tabUser.classList.add("narrow_tab_user");
      tabUser.classList.remove("extend_tab_user");
      element.classList.add("open_information");
      element.classList.remove("close_information");
      element.classList.remove("hide_element");
      btnExpand.classList.remove("btn_rotate");
    }

    this.hideInfo = !this.hideInfo;
  }

  callOmiCall(phone) {
    omiSDK.makeCall(phone, { datas: { 'User-Data': "phone_" + phone } });
  }

}
