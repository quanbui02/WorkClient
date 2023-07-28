import { TagsService } from './../services/tags.service';
import { TagsEditComponent } from './tags-edit/tags-edit.component';
import { DynamicDialogRef, DialogService } from 'primeng/api';
import { NewsService } from './../services/news.service';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../lib-shared/services/user.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: ''
  };
  userId: number;
  ref: DynamicDialogRef;

  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    // private _signalRService: SignalRService,
    private _tagsService: TagsService,
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
        field: 'tagName',
        header: 'Tên từ khóa',
        visible: true,
        sort: true,

      },
      {
        field: 'countNews',
        header: 'Số lượng tin tức',
        align: 'center',
        visible: true,
        sort: false,
        width: '150px'
      },
      // {
      //   field: 'isActive',
      //   header: 'Trạng thái hoạt động',
      //   visible: true,
      //   sort: false,
      //   width: '150px',
      //   align: 'center'
      // },
      {
        field: 'createdDate',
        header: 'Ngày tạo',
        visible: true,
        align: 'center',
        sort: true,
        width: '150px'
      }
    ];
  }

  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._tagsService.Gets(
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
      this._tagsService.delete(id).then(re => {
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
    this._tagsService.ChangeActive(id).then(re => {
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
    this.ref = this.dialogService.open(TagsEditComponent, {
      data: {
        tagId: id
      },
      header: 'Thêm/sửa từ khóa',
      width: '60%',
      height: '160px',
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
