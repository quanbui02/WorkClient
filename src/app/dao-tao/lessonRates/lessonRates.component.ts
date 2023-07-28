import { LessonRatesLessonComponent } from './lessonRates-lesson/lessonRates-lesson.component';
import { LessonRatesEditComponent } from './lessonRates-edit/lessonRates-edit.component';
import { ConfigurationService } from './../../lib-shared/services/configuration.service';
import { LessonRatesService } from './../services/lessonRates.service';
import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../lib-shared/services/user.service';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
// declare var omiSDK: any;

@Component({
  selector: 'app-lessonRates',
  templateUrl: './lessonRates.component.html',
  styleUrls: ['./lessonRates.component.scss']
})
export class LessonRatesComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: '',
    rating: -1,
    fromDate: '',
    toDate: '',
    isActive: null,
  };
  rating_options: any[];
  active_options: any[];
  userId: number;
  ref: DynamicDialogRef;
  vi: any;

  @ViewChild(LessonRatesEditComponent) _lessonRatesEdit: LessonRatesEditComponent;
  @ViewChild(LessonRatesLessonComponent) _lessonRatesLessonEdit: LessonRatesLessonComponent;
  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    private _lessonRatesService: LessonRatesService,
    public dialogService: DialogService,
    private _configurationService: ConfigurationService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.loadTableColumnConfig();
    await this.loadRatingOptions();
    await this.loadActiveOptions();
    await this.getData();

    this.vi = this._configurationService.calendarVietnamese;
    this.userId = this._userService.getBasicUserInfo().userId;
  }

  loadTableColumnConfig() {
    this.cols = [
      {
        field: 'createdDate',
        header: 'Ngày đánh giá',
        visible: true,
        sort: false,
        width: '8%',
        dataType: 'date',
        align: 'center'
      },
      {
        field: 'lessonName',
        header: 'Bài giảng',
        visible: true,
        sort: false,
        width: '20%'
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
        field: 'userRating',
        header: 'Người phản hồi',
        visible: true,
        align: 'left',
        sort: false,
        width: '8%'
      },
      {
        field: 'isActive',
        header: 'Trạng thái hoạt động',
        visible: true,
        sort: false,
        width: '8%',
        align: 'center'
      },
    ];
  }

  async loadRatingOptions() {
    this.rating_options = [{ label: '-- Số sao đánh giá --', value: -1 }];
    this.rating_options.push({ label: "5 sao", value: 5 });
    this.rating_options.push({ label: "4 sao", value: 4 });
    this.rating_options.push({ label: "3 sao", value: 3 });
    this.rating_options.push({ label: "2 sao", value: 2 });
    this.rating_options.push({ label: "1 sao", value: 1 });
  }

  async loadActiveOptions() {
    this.active_options = [{ label: '-- Trạng thái hoạt động --', value: null }];
    this.active_options.push({ label: 'Đang hoạt động', value: true });
    this.active_options.push({ label: 'Không hoạt động', value: false });
  }


  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._lessonRatesService.Gets(
      this.searchModel.key,
      this.searchModel.rating,
      0,
      this.searchModel.fromDate,
      this.searchModel.toDate,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
      this.isAsc,
      this.searchModel.isActive
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        this.total = rs.totalRecord;
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._lessonRatesService.DeleteByLessionRateId(id).then(re => {
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
    this._lessonRatesService.ChangeActive(id).then(re => {
      if (re.status) {
        var index = this.dataSource.findIndex(x => x.id == re.data.id)
        this.dataSource[index].isActive = re.data.isActive;
      }
      else {
        this._notifierService.showError(re.message);
      }
    })
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

  // onShowOrder(id: any) {
  //   this._orderEdit.showPopup(id);
  // }

  // callOmiCall(item) {
  //   omiSDK.makeCall(item.phone, { datas: { 'User-Data': "UserId_" + item.userId } });
  // }
  // onEdit(id: any) {
  //   this._orderDetailEditComponent.showPopup(id);
  // }
  onEditRating(id: any) {
    this._lessonRatesEdit.showPopup(id);
  }

  // onEditDetailLessonRating(id: any) {
  //   this._lessonRatesLessonEdit.showPopup(id);
  // }

}
