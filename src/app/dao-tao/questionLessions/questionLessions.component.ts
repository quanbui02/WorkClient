import { QuestionLessonLessonDetailComponent } from './questionLesson-lessonDetail/questionLesson-lessonDetail.component';
import { QuestionLessionsEditComponent } from './questionLessions-edit/questionLessions-edit.component';
import { QuestionLessonsService } from './../services/questionLessons.service';
import { LessonsService } from './../services/lessons.service';
import { ConfigurationService } from './../../lib-shared/services/configuration.service';
import { async } from '@angular/core/testing';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../lib-shared/services/user.service';

@Component({
  selector: 'app-questionLessions',
  templateUrl: './questionLessions.component.html',
  styleUrls: ['./questionLessions.component.scss']
})
export class QuestionLessionsComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: '',
    // fromDate: '',
    // toDate: '',
    idLesson: 0,
    isActive: null,

  };
  userId: number;
  active_options = [];
  lesson_options = [];
  vi: any;

  @ViewChild(QuestionLessionsEditComponent) _questionLessionsComponent: QuestionLessionsEditComponent;
  @ViewChild(QuestionLessonLessonDetailComponent) _questionLessonLessonDetailComponent: QuestionLessonLessonDetailComponent;
  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    // private _signalRService: SignalRService,
    private _lessonService: LessonsService,
    private _questionLessonsService: QuestionLessonsService,
    private _configurationService: ConfigurationService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.vi = this._configurationService.calendarVietnamese;

    this.loadTableColumnConfig();
    await this.getData();

    this.userId = this._userService.getBasicUserInfo().userId;
    await this.loadActiveOptions();
    await this.loadPathologyCategoryOptions();
  }

  loadTableColumnConfig() {
    this.cols = [
      {
        field: 'lessonName',
        header: 'Bài giảng',
        visible: true,
        sort: false,
        align: 'left',
        width: '20%'
      },
      {
        field: 'summary',
        header: 'Tóm tắt',
        align: 'left',
        visible: true,
        sort: false,
        width: '20%'
      },
      {
        field: 'contentQuestion',
        header: 'Nội dung câu hỏi',
        align: 'left',
        visible: true,
        sort: false,

      },
      {
        field: 'isActive',
        header: 'Trạng thái hoạt động',
        visible: true,
        sort: false,
        width: '8%',
        align: 'center'
      },
      {
        field: 'createdDate',
        header: 'Ngày tạo',
        visible: true,
        align: 'center',
        sort: false,
        width: '6%',
        dataType: 'date'
      }
    ];
  }

  async loadActiveOptions() {
    this.active_options = [{ label: '-- Trạng thái hoạt động --', value: null }];
    this.active_options.push({ label: 'Đang hoạt động', value: true });
    this.active_options.push({ label: 'Không hoạt động', value: false });
  }

  async loadPathologyCategoryOptions() {
    this.lesson_options = [{ label: 'Danh mục bài giảng', value: 0 }];
    await this._lessonService.Gets("", 0, 1000, "", false).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.lesson_options.push({ label: value.name, value: value.id });
        });
      }
    });
  }

  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._questionLessonsService.Gets(
      this.searchModel.key,
      this.searchModel.idLesson,
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

  onSearch() {
    this.getData();
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._questionLessonsService.DeleteByQuestionLessionId(id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.dataSource = this.dataSource.filter(obj => obj.id !== id);
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  // BackToDelete(id: number) {
  //   this._newsService.BackToDelete(id).then(re => {
  //     if (re.status) {
  //       this._notifierService.showSuccess('Cập nhật thành công');
  //       this.dataSource = this.dataSource.filter(obj => obj.id !== id);
  //     }
  //   }).catch(err => {
  //     this._notifierService.showDeleteDataError();
  //   })
  // }

  changeActive(id: number) {
    this._questionLessonsService.ChangeActive(id).then(re => {
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

  onEdit(id: any) {
    this._questionLessionsComponent.showPopup(id);
  }

  // onEditDetailLessonQuestion(id: any) {
  //   this._questionLessonLessonDetailComponent.showPopup(id);
  // }
}

