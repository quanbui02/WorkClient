import { async } from '@angular/core/testing';
import { NewsService } from './../services/news.service';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { SignalRService } from '../../lib-shared/services/signalr.service';
import { environment } from '../../../environments/environment';
import { UserService } from '../../lib-shared/services/user.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: '',
    isActive: null,
    isDelete: false
  };
  userId: number;
  active_options = [];
  delete_options = [];

  @ViewChild(NewsEditComponent) _NewsEditComponent: NewsEditComponent;

  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    // private _signalRService: SignalRService,
    private _newsService: NewsService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.loadTableColumnConfig();
    await this.getData();

    this.userId = this._userService.getBasicUserInfo().userId;
    await this.loadActiveOptions();
    await this.loadDeleteOptions();
  }

  loadTableColumnConfig() {
    this.cols = [
      {
        field: 'image',
        header: 'Ảnh đại diện',
        visible: true,
        sort: false,
        width: '95px'
      },
      {
        field: 'name',
        header: 'Tên',
        align: 'left',
        visible: true,
        sort: false
      },
      {
        field: 'isActive',
        header: 'Trạng thái hoạt động',
        visible: true,
        sort: false,
        width: '100px',
        align: 'center'
      },
      {
        field: 'createdDate',
        header: 'Ngày tạo',
        visible: true,
        align: 'center',
        sort: false,
        width: '100px'
      }
    ];
  }

  async loadActiveOptions() {
    this.active_options = [{ label: '-- Trạng thái hoạt động --', value: null }];
    this.active_options.push({ label: 'Đang hoạt động', value: true });
    this.active_options.push({ label: 'Không hoạt động', value: false });
  }

  async loadDeleteOptions() {
    this.delete_options = [{ label: 'Không xóa', value: false }];
    this.delete_options.push({ label: 'Đã xóa', value: true });
  }

  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._newsService.Gets(
      this.searchModel.key,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
      this.isAsc,
      this.searchModel.isActive,
      this.searchModel.isDelete
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
      this._newsService.DeleteByNewId(id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.dataSource = this.dataSource.filter(obj => obj.id !== id);
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  BackToDelete(id: number) {
    this._newsService.BackToDelete(id).then(re => {
      if (re.status) {
        this._notifierService.showSuccess('Cập nhật thành công');
        this.dataSource = this.dataSource.filter(obj => obj.id !== id);
      }
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    })
  }

  changeActive(id: number) {
    this._newsService.ChangeActive(id).then(re => {
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
    // this.dataSource = [...this.dataSource];
  }
  onCloseForm() {
    this.getData();
  }

  onEdit(id: any) {
    this._NewsEditComponent.showPopup(id);
  }
}
