
import { DynamicDialogRef, DialogService } from 'primeng/api';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { DeliveryCategoriesService } from '../services/deliverycategories.service';
import { DeliveryCategoriesEditComponent } from './delivery-categories-edit/DeliveryCategories-edit.component';

@Component({
  selector: 'app-DeliveryCategories',
  templateUrl: './DeliveryCategories.component.html',
  styleUrls: ['./DeliveryCategories.component.scss']
})
export class DeliveryCategoriesComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: ''
  };
  userId: number;
  ref: DynamicDialogRef;

  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    // private _signalRService: SignalRService,
    private _deliveryCategoriesService: DeliveryCategoriesService,
    public dialogService: DialogService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.loadTableColumnConfig();
    await this.getData();

    this.userId = this._userService.getBasicUserInfo().userId;
  }

  loadTableColumnConfig() {
    this.cols = [
      {
        field: 'code',
        header: 'Mã đơn vị',
        visible: true,
        sort: true,
        width: '10%',
      },
      {
        field: 'name',
        header: 'Tên đơn vị',
        visible: true,
        sort: true,

      },
      {
        field: 'endPoint',
        header: 'Link kết nối dịch vụ',
        visible: true,
        sort: true,
        width: '25%',
      },
      {
        field: 'isActived',
        header: 'Trạng thái hoạt động',
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
        sort: true,
        width: '15%'
      }
    ];
  }

  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._deliveryCategoriesService.Gets(
      this.searchModel.key,
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
      this._deliveryCategoriesService.Delete(id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.dataSource = this.dataSource.filter(obj => obj.id !== id);
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  changeActive(id: number) {
    this._deliveryCategoriesService.ChangeActive(id).then(re => {
      if (re.status) {
        var index = this.dataSource.findIndex(x => x.id == re.data.id)
        this.dataSource[index].isActive = re.data.isActive;
      }
      else {
        this._notifierService.showError(re.message);
      }
    })
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

  onEdit(id) {
    this.ref = this.dialogService.open(DeliveryCategoriesEditComponent, {
      data: {
        deliveryCategoriesId: id
      },
      header: 'Thêm/sửa Danh mục đơn vị vận chuyển',
      width: '60%',
      height: '300px',
      styleClass: "vs-modal",
      contentStyle: { 'overflow': 'auto', 'background-color': '#fff' }, //'max-height': 'calc(100vh - 180px);', 
      baseZIndex: 1001,
      closeOnEscape: true
    });

    this.ref.onClose.subscribe((re: any) => {
      this.getData();
      if (re != null) {
        this.isLoading = false;
      }
    });
  }
}
