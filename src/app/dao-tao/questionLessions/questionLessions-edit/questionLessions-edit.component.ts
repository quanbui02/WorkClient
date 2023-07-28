import { QuestionLessonsService } from './../../services/questionLessons.service';
import { LessonsService } from './../../services/lessons.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-questionLessions-edit',
  templateUrl: './questionLessions-edit.component.html',
  styleUrls: ['./questionLessions-edit.component.scss']
})
export class QuestionLessionsEditComponent extends SecondPageEditBase
  implements OnInit {
  isLoading = false;
  modelEdit: any = {};
  dataTags: any = [];
  // tag_options: any = [];
  lesson_options: any = [];
  hideHtml = true;
  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _lessonService: LessonsService,
    private _questionLessonsService: QuestionLessonsService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      summary: ['', Validators.required],
      sort: [''],
      contentQuestion: ['', Validators.required],
      idLesson: ['', Validators.required],
      // hideHtml: ['']
    });

    // await this.loadTagsOption();
    await this.loadPathologyCategoryOptions();
  }

  async loadPathologyCategoryOptions() {
    // this.lesson_options = [{ label: 'Danh mục bài giảng', value: 0 }];
    await this._lessonService.Gets("", 0, 1000, "", false).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.lesson_options.push({ label: value.name, value: value.id });
        });
      }
    });
  }
  // async loadLessonOption() {
  //   await this._lessonService.get(0, '').then(rs => {
  //     if (rs.status) {
  //       rs.data.forEach(item => {
  //         item.label = item.name;
  //         item.value = item.id;
  //       });
  //       this.cate_options = rs.data;
  //     }
  //   });
  // }

  save() {
    this._questionLessonsService.Save(this.modelEdit).then(rs => {
      if (rs.status) {
        this._notifierService.showSuccess('Cập nhật thành công');
        this.isShow = false;
        this.closePopup.emit();
        this.modelEdit = {};
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

  async showPopup(id: any) {
    this.hideHtml = true;
    this.isShow = true;
    if (id > 0) {
      await this._questionLessonsService.GetById(id)
        .then(async response => {
          if (response.status) {
            this.modelEdit = response.data;
            this.modelEdit.idLesson = 0;
          }
        }, () => {
          this._notifierService.showHttpUnknowError();
        });
    } else {
      this.modelEdit = {};
    }
  }

  ShowHideHtml() {
    this.hideHtml = !this.hideHtml;
  }
}