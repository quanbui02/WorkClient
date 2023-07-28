import { FeedbackEditComponent } from './feedback-edit/feedback-edit.component';
import { FeedbacksService } from './../services/feedback.service';
import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { FeedbackCategoriesService } from '../services/feedbackCategories.service';
import { FeedbackStatusService } from '../services/feedbackStatus.service';
import { OrderEditComponent } from '../ctv/orders/order-edit/order-edit.component';
import { UserService } from '../../lib-shared/services/user.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: '',
    idStatus: 0,
    idCate: 0
  };
  status_options: any[];
  cate_options: any[];

  userId: number;
  topic = ['dapfood'];

  @ViewChild(OrderEditComponent) _orderEdit: OrderEditComponent;
  @ViewChild(FeedbackEditComponent) _FeedbackEditComponent: FeedbackEditComponent;

  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    private _feedbackService: FeedbacksService,
    private _feedbackCategories: FeedbackCategoriesService,
    private _feedbackStatus: FeedbackStatusService
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.loadTableColumnConfig();
    await this.loadCateOptions();
    await this.loadStatusOptions();
    await this.getData();
  }

  notifyTrigger(data: any) {
    if (data.type === 1) {
      //this.notifications.unshift(data);

      // if (this.notifications.length > this.maxNotification) {
      //     this.notifications.pop();
      // }

      //this.totalUnRead++;
    } else if (data.type === 3) {
      this.dataSource.unshift(JSON.parse(data.data.object));

      // if (data.data) {
      //   if (data.data.topic)
      //     this._signalRService.subscribeViewCode(data.data.topic, this.notifyTrigger.bind(this));
      // }
    }
  }

  loadTableColumnConfig() {
    this.cols = [
      {
        field: 'content',
        header: 'Phản hồi',
        visible: true,
        sort: false,
      },
      {
        field: 'idFeedbackCategorieNavigation',
        header: 'Danh mục',
        align: 'center',
        visible: true,
        sort: false,
        width: '10%'
      },
      {
        field: 'idFeedbackStatusNavigation',
        header: 'Trạng thái',
        align: 'center',
        visible: true,
        sort: false,
        width: '10%'
      },
      {
        field: 'idOrder',
        header: 'Đơn hàng',
        visible: true,
        sort: false,
        width: '5%',
        align: 'center'
      },
      {
        field: 'createdDate',
        header: 'Ngày tạo',
        visible: true,
        align: 'center',
        sort: false,
        width: '7%'
      },
      {
        field: 'note',
        header: 'Trả lời',
        visible: true,
        sort: false,
        width: '25%'
      },
    ];
  }

  async loadCateOptions() {
    this.cate_options = [{ label: '-- Danh mục --', value: 0 }];
    await this._feedbackCategories.Gets("", 0, 100, "", true).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.cate_options.push({ label: value.name, value: value.id });
        });
      }
    });
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
    await this._feedbackService.Gets(
      this.searchModel.key,
      this.searchModel.idCate,
      this.searchModel.idStatus,
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

  onSearch() {
    this.getData();
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._feedbackService.delete(id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.dataSource = this.dataSource.filter(obj => obj.id !== id);
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
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

  onEdit(id: any) {
    this._FeedbackEditComponent.showPopup(id);
  }
  onShowOrder(id: any) {
    this._orderEdit.showPopup(id);
  }
}
