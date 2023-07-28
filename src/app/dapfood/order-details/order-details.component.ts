import { OrderDetailRatingComponent } from './order-detail-rating/order-detail-rating.component';
import { OrderDetailsEditComponent } from './order-details-edit/order-details-edit.component';
import { OrderDetailsService } from './../services/orderdetails.service';
import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../lib-shared/services/user.service';
import { FeedbackStatusService } from '../services/feedbackStatus.service';
import { OrderClientEditComponent } from '../doanh-nghiep/order-client/order-client-edit/order-client-edit.component';
import { CustomerInfoComponent } from '../cskh/customer-info/customer-info.component';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
declare var omiSDK: any;

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: '',
    starRating: 0,
    feedbackStatus: 0
  };
  rating_options: any[];
  status_options: any[];
  userId: number;
  ref: DynamicDialogRef;

  @ViewChild(OrderClientEditComponent) _orderEdit: OrderClientEditComponent;
  @ViewChild(OrderDetailsEditComponent) _orderDetailEditComponent: OrderDetailsEditComponent;
  @ViewChild(OrderDetailRatingComponent) _orderDetailRatingComponent: OrderDetailRatingComponent;
  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    private _orderDetailsService: OrderDetailsService,
    public dialogService: DialogService,
    private _feedbackStatus: FeedbackStatusService
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.loadTableColumnConfig();
    await this.loadRatingOptions();
    await this.getData();

    this.userId = this._userService.getBasicUserInfo().userId;
    this.loadStatusOptions();
  }

  loadTableColumnConfig() {
    this.cols = [
      {
        field: 'dateRating',
        header: 'Ngày đánh giá',
        visible: true,
        sort: false,
        width: '6%'
      },
      {
        field: 'imageProduct',
        header: 'Ảnh sản phẩm',
        visible: false,
        sort: false,
        width: '4%'
      },
      {
        field: 'nameProduct',
        header: 'Tên sản phẩm',
        align: 'left',
        visible: true,
        sort: false,
        width: '15%'
      },
      {
        field: 'orderId',
        header: 'Đơn hàng',
        visible: true,
        sort: false,
        width: '4%',
        align: 'center'
      },
      {
        field: 'rating',
        header: 'Đánh giá',
        align: 'center',
        visible: true,
        sort: false,
        width: '4%'
      },
      {
        field: 'comment',
        header: 'Nội dung đánh giá',
        align: 'left',
        visible: true,
        sort: false
      },
      {
        field: 'commentImages',
        header: 'Hình ảnh đánh giá',
        align: 'left',
        visible: true,
        sort: false,
        width: '20%'
      },
      {
        field: 'userRating',
        header: 'Khách hàng',
        visible: true,
        align: 'left',
        sort: false,
        width: '8%'
      },
      {
        field: 'idStatus',
        header: 'Trạng thái xử lý',
        visible: true,
        align: 'center',
        sort: false,
        width: '7%'
      },
      {
        field: 'note',
        header: 'Ghi chú',
        visible: true,
        align: 'left',
        sort: false,
        width: '13%'
      },
    ];
  }

  async loadRatingOptions() {
    this.rating_options = [{ label: '-- Số sao đánh giá --', value: 0 }];
    this.rating_options.push({ label: "5 sao", value: 5 });
    this.rating_options.push({ label: "4 sao", value: 4 });
    this.rating_options.push({ label: "3 sao", value: 3 });
    this.rating_options.push({ label: "2 sao", value: 2 });
    this.rating_options.push({ label: "1 sao", value: 1 });
  }

  async loadStatusOptions() {
    this.status_options = [{ label: '-- Trạng thái --', value: 0 }];
    await this._feedbackStatus.Gets("", 0, 100, "", true).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.status_options.push({ label: value.name, value: value.id });
        });
      }
    });
  }

  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._orderDetailsService.GetData(
      this.searchModel.key,
      this.searchModel.starRating,
      this.searchModel.feedbackStatus,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
      this.isAsc
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        this.total = rs.totalRecord;
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }

  split_string(item: string): string[] {
    return item.split(",");
  }

  onSearch() {
    this.getData();
  }

  toggleSearch() {
    super.toggleSearch();
    this.fixTableScrollProblem();
  }
  onChangeRowLimit() {
    this.fixTableScrollProblem();
  }
  // fix vụ lệch header ở table khi xuất hiện thanh scroll
  fixTableScrollProblem() {
    this.dataSource = [...this.dataSource];
  }
  onCloseForm() {
    this.getData();
  }

  onShowOrder(id: any) {
    this._orderEdit.showPopup(id);
  }

  callOmiCall(item) {
    omiSDK.makeCall(item.phone, { datas: { 'User-Data': "UserId_" + item.userId } });
  }
  onEdit(id: any) {
    this._orderDetailEditComponent.showPopup(id);
  }
  onEditRating(id: any) {
    this._orderDetailRatingComponent.showPopup(id);
  }

  onShowDetailUserCurr(item) {
    this.ref = this.dialogService.open(CustomerInfoComponent, {
      data: {
        userId: item
      },
      header: 'Thông tin khách hàng',
      width: '95%',
      height: 'calc(100vh - 100px)',
      styleClass: "vs-modal",
      contentStyle: { 'overflow': 'auto', 'position': 'relative' }, //'max-height': 'calc(100vh - 180px);', 
      baseZIndex: 1001,
      closeOnEscape: true
    });

    this.ref.onClose.subscribe((re: any) => {
      this.isLoading = false;
    });
  }

}
