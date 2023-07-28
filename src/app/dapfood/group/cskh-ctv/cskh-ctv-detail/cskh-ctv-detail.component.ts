import { ConfigurationService } from './../../../../lib-shared/services/configuration.service';
import { CustomerInfoComponent } from './../../../cskh/customer-info/customer-info.component';
import { DialogService } from 'primeng/primeng';
import { OrdersDetailShipComponent } from './../../../doanh-nghiep/order-client/orders-detail-ship/orders-detail-ship.component';
import { OrderClientEditComponent } from './../../../doanh-nghiep/order-client/order-client-edit/order-client-edit.component';
import { ProductService } from './../../../services/products.service';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { SecondPageIndexBase } from '../../../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../../../lib-shared/services/user.service';
import { OmiCallLogsService } from '../../../services/OmiCallLogs.service';
import { OrdersService } from '../../../services/orders.service';


@Component({
  selector: 'app-cskh-ctv-detail',
  templateUrl: './cskh-ctv-detail.component.html',
  styleUrls: ['./cskh-ctv-detail.component.scss']
})
export class CskhCtvDetailComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    fromDate: '',
    toDate: '',
    fromDateStatistic: '',
    toDateStatistic: '',
    fromDateCustomer: '',
    toDateCustomer: '',
    statusType: 0,
    status: [0]
  };
  cols = [];
  cols2 = [];
  cols3 = [];
  userId: number = 0;
  modelEdit: any = {};
  isLoading = false;
  isView = false;
  listOrder: any;
  ListUser: any;
  listProductStatistics: any;
  pageUser = 1;
  limitUser = 100;
  pageOrder = 1;
  limitOrder = 100;
  pageProductStatistics = 1;
  limitProductStatistics = 100;
  index = 0;
  listItemNumberPerPage = [
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '200', value: 200 },
    { label: '500', value: 500 },
    { label: '1000', value: 1000 },
  ];
  vi: any;
  list_statusType = [];
  totalUser = 0;
  totalOrder = 0;
  totalProductStatistics = 100;
  dataTotal = [];
  dataTotalCustomer = [];

  totals = 0;
  ships = 0;
  totalBills = 0;

  @ViewChild(OrderClientEditComponent) _orderEdit: OrderClientEditComponent;
  @ViewChild(OrdersDetailShipComponent) _OrdersDetailShip: OrdersDetailShipComponent;

  constructor(
    protected _injector: Injector,
    private _userRoleService: UserService,
    public _OmicallLogsService: OmiCallLogsService,
    private _OrdersService: OrdersService,
    private _ProductService: ProductService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public dialogService: DialogService,
    private _configurationService: ConfigurationService,

  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.vi = this._configurationService.calendarVietnamese;
    this.cols = [
      {
        field: 'name',
        header: 'Tên khách hàng',
        visible: true,
        align: 'left',
      },
      {
        field: 'createdDate',
        header: 'Ngày tham gia',
        visible: true,
        align: 'center',
        width: '8%',
      },
      // {
      //   field: 'avatar',
      //   header: 'Ảnh đại diện',
      //   visible: true,
      //   align: 'center',
      //   width: '10%',
      // },
      {
        field: 'countOrdersFinish',
        header: 'Số lượng đơn hoàn thành',
        visible: true,
        align: 'center',
        width: '10%',
        sort: true,
        // width: '15%',
      },
      {
        field: 'totalOrdersFinish',
        header: 'Tổng tiền',
        width: '10%',
        visible: true,
        align: 'right',
        sort: true,
      },
      {
        field: 'totalRewardFinish',
        header: 'Tiền hoa hồng',
        width: '10%',
        visible: true,
        align: 'right',
        sort: true,
      }
    ];
    this.cols2 = [
      {
        field: 'code',
        header: 'Mã đơn',
        visible: true,
        align: 'center',
        width: '8%',
      },
      {
        field: 'createdDate',
        header: 'Thời gian đặt hàng',
        visible: true,
        dataType: 'date',
        align: 'center',
        width: '7%',
      },
      {
        field: 'deliveryDate',
        header: 'Thời gian nhận hàng',
        visible: true,
        dataType: 'date',
        align: 'center',
        width: '7%',
      },
      {
        field: 'buyer',
        header: 'Người đặt',
        width: '10%',
        visible: true,
      },
      {
        field: 'listNameProduct',
        header: 'Tên sản phẩm',
        visible: true,
        // width: '15%',
      },
      // {
      //   field: 'deliveryInformation',
      //   header: 'Thông tin nhận hàng',
      //   visible: true,
      //   width: '15%',
      // },
      {
        field: 'isPrepay',
        header: 'Thanh toán',
        width: '4%',
        visible: true,
        align: 'center',
      },
      {
        field: 'shopName',
        header: 'Cửa hàng',
        visible: true,
        align: 'left',
        width: '15%',
      },
      {
        field: 'total',
        header: 'Tiền hàng',
        dataType: 'number',
        visible: true,
        width: '8%',
        align: 'right',
        sort: true
      },
      {
        field: 'totalBill',
        header: 'Tổng tiền',
        dataType: 'number',
        visible: true,
        width: '8%',
        align: 'right',
        sort: true
      },
      {
        field: 'totalReward',
        header: 'Tiền hoa hồng',
        dataType: 'number',
        visible: true,
        width: '8%',
        align: 'right',
        sort: true
      },
      {
        field: 'status',
        header: 'Trạng thái',
        visible: true,
        align: 'center',
        width: '7%',
      }
    ];
    this.cols3 = [
      {
        field: 'code',
        header: 'Mã sản phẩm',
        visible: true,
        align: 'center',
        width: '10%',
      },
      {
        field: 'name',
        header: 'Tên sản phẩm',
        visible: true,
        align: 'left',
      },
      {
        field: 'quantity',
        header: 'Số lượng đã bán',
        visible: true,
        align: 'center',
        width: '10%',
        sort: true,
        // width: '15%',
      },
      {
        field: 'totalAmount',
        header: 'Doanh số',
        visible: true,
        align: 'right',
        width: '10%',
        sort: true,
      },
      {
        field: 'totalReward',
        header: 'Hoa hồng',
        visible: true,
        align: 'right',
        width: '10%',
        sort: true,
      },
    ];
    this.userId = this.config.data.userId;
    await this.getDataListUser(this.userId);
    await this.getDataOrder(this.userId);
    await this.getDataProductStatistics(this.userId);
  }

  closeAndSelected() {
    this.ref.close(null);
  }

  // fix vụ lệch header ở table khi xuất hiện thanh scroll
  fixTableScrollProblem() {
    this.listOrder = [...this.listOrder];
  }

  // fix vụ lệch header ở table khi xuất hiện thanh scroll
  fixTableScrollProblemUser() {
    this.ListUser = [...this.ListUser];
  }

  // fix vụ lệch header ở table khi xuất hiện thanh scroll
  fixTableScrollProblemProductStatistics() {
    this.ListUser = [...this.ListUser];
  }

  onChangeRowLimitUser() {
    this.getDataListUser(this.userId);
    this.fixTableScrollProblemUser();
  }

  onChangeRowLimit() {
    this.getDataOrder(this.userId);
    this.fixTableScrollProblem();
  }

  onChangeRowLimitProductStatistics() {
    this.getDataProductStatistics(this.userId);
    this.fixTableScrollProblemProductStatistics();
  }

  async getDataListUser(id: any) {
    this.isLoading = true;
    this.isView = true;
    await this._userRoleService.GetsInvitedKOLById(id, "", this.searchModel.fromDateCustomer, this.searchModel.toDateCustomer, (this.pageUser - 1) * this.limitUser, this.limitUser, this.sortField, this.isAsc).then(async response => {
      this.isLoading = false;
      if (response.status) {
        this.ListUser = response.data;
        this.totalUser = response.totalRecord;
        this.dataTotalCustomer = [response.dataTotal];
        console.log(this.dataTotalCustomer);
        // this.modelEdit.isSuperUserBool = this.modelEdit.isSuperUser();
      }
    })
  }

  async getDataOrder(Userid: number = 0) {
    await this._OrdersService.GetsKOLIdsStatus(Userid, "", 0, "", 0, this.searchModel.fromDate, this.searchModel.toDate, -1, (this.pageOrder - 1) * this.limitOrder, this.limitOrder, this.sortField, this.isAsc).then(rs => {
      if (rs.status) {
        this.listOrder = rs.data;
        this.totalOrder = rs.totalRecord;
        this.dataTotal = [rs.dataTotal];
        console.log(this.dataTotal);
      }
    });
  }

  async getDataProductStatistics(Userid: number = 0) {
    await this._ProductService.ProductStatisticsOrderByCTV(Userid, this.searchModel.fromDateStatistic, this.searchModel.toDateStatistic, (this.pageProductStatistics - 1) * this.limitProductStatistics, this.limitProductStatistics, this.sortField, this.isAsc).then(rs => {
      if (rs.status) {
        this.listProductStatistics = rs.data;
        this.totalProductStatistics = rs.totalRecord;
        // this.dataTotal = [rs.dataTotal];
      }
    });
  }

  getAvatar(id) {
    if (id) {
      return this.getImageAvatar(id);
    }
    else {
      return `/assets/images/avatar.jpg`;
    }
  }

  onSearch() {
    this.getDataOrder(this.userId);
  }

  onSearchStatistic() {
    this.getDataProductStatistics(this.userId);
  }

  onSearchCustomer() {
    this.getDataListUser(this.userId);
  }

  onPageOrder(event: any): void {
    this.pageOrder = (event.first / event.rows) + 1;
    this.limitOrder = event.rows;
    this.getDataOrder(this.userId);
  }

  onPageUser(event: any): void {
    this.pageUser = (event.first / event.rows) + 1;
    this.limitUser = event.rows;
    this.getDataListUser(this.userId);
  }

  onPageProductStatistics(event: any): void {
    this.pageProductStatistics = (event.first / event.rows) + 1;
    this.limitProductStatistics = event.rows;
    this.getDataProductStatistics(this.userId);
  }


  onSortUser(event: any) {
    console.log
    this.sortField = event.field;
    this.isAsc = event.order === 1 ? false : true;
    this.getDataListUser(this.userId);

    this.sortField = "";
    this.isAsc = false;
  }

  onSortOrder(event: any) {
    this.sortField = event.field;
    this.isAsc = event.order === 1 ? false : true;
    this.getDataOrder(this.userId);

    this.sortField = "";
    this.isAsc = false;
  }

  onSortProductStatistics(event: any) {
    this.sortField = event.field;
    this.isAsc = event.order === 1 ? false : true;
    this.getDataProductStatistics(this.userId);

    this.sortField = "";
    this.isAsc = false;
  }

  onShowPopup(id) {
    this._orderEdit.showPopup(id)
  }

  onShipDetail(codeShip) {
    this._OrdersDetailShip.showPopup(codeShip);
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
        // this.UpdateDataSource(item);
        this.isLoading = false;
      }
    });
  }

}
