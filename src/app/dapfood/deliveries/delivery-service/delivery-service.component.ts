import { async } from '@angular/core/testing';
import { DeliveryServiceEditComponent } from './delivery-service-edit/delivery-service-edit.component';
import { DeliveriesService } from './../services/deliveries.service';
import { DynamicDialogRef, DialogService } from 'primeng/api';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { DeliveryCategoriesService } from '../services/deliverycategories.service';
import { TreeNode } from 'primeng/api';
import studentsData from './filesystem.json';

@Component({
  selector: 'app-delivery-service',
  templateUrl: './delivery-service.component.html',
  styleUrls: ['./delivery-service.component.scss']
})
export class DeliveryServiceComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: ''
  };
  userId: number;
  ref: DynamicDialogRef;

  @ViewChild(DeliveryServiceEditComponent) _deliveryServiceEditComponent: DeliveryServiceEditComponent;

  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    private _deliveriesService: DeliveriesService,
    public dialogService: DialogService
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.loadTableColumnConfig();

    await this.getData();

    //console.log("duc lieu json = " + JSON.stringify(this.filesdata));

    this.userId = this._userService.getBasicUserInfo().userId;
  }


  loadTableColumnConfig() {
    this.cols = [
      {
        field: 'name',
        header: 'Tên đơn vị',
        visible: true,
        sort: true,
      },
      {
        field: 'isActived',
        header: 'Hoạt động',
        visible: true,
        sort: false,
        width: "5%",
        align: "center"
      }
    ];
  }

  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._deliveriesService.GetByDelivery(
      this.searchModel.key,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
      this.isAsc
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        // console.log("data truoc xoa" + JSON.stringify(this.dataSource))
        this.total = rs.totalRecord;
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }

  onDelete(idParent: number, id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._deliveriesService.Delete(id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          let indexParent = this.dataSource.findIndex(x => x.data.id == idParent);
          this.dataSource[indexParent].children = this.dataSource[indexParent].children.filter(x => x.data.id !== id)
          // console.log(this.dataSource[indexParent])
          // console.log("data sau xoa" + JSON.stringify(this.dataSource))
          this.getData();
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  changeActive(id: number) {
    this._deliveriesService.ChangeActive(id).then(re => {
      if (re.status) {
        // this.dataSourceChildren[index].filter(x => x.id == re.data.id)[0].isActived = re.data.isActived;
        // if (re.data.isActived) {
        //   this.dataSourceChildren[index].filter(x => x.id != re.data.id).forEach(value => {
        //     value.isActived = false;
        //   });
        // }
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

  onEdit(id: any) {
    this._deliveryServiceEditComponent.showPopup(id);
  }
  // onEdit(id) {
  //   this.ref = this.dialogService.open(DeliveryServiceEditComponent, {
  //     data: {
  //       deliveryId: id
  //     },
  //     header: 'Thêm/sửa Danh mục đơn vị vận chuyển',
  //     width: '60%',
  //     height: '50%',
  //     styleClass: "vs-modal",
  //     contentStyle: { 'overflow': 'auto', 'background-color': '#fff' }, //'max-height': 'calc(100vh - 180px);', 
  //     baseZIndex: 1001,
  //     closeOnEscape: true
  //   });

  //   this.ref.onClose.subscribe((re: any) => {
  //     this.getData();
  //     if (re != null) {
  //       this.isLoading = false;
  //     }
  //   });
  // }
}
