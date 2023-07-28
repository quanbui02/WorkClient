import { CourseLessonsService } from './../../services/courseLessons.service';
import { LessonsService } from './../../services/lessons.service';
import { CoursesService } from './../../services/courses.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-Courses-lesson',
  templateUrl: './Courses-lesson.component.html',
  styleUrls: ['./Courses-lesson.component.scss']
})
export class CoursesLessonComponent extends SecondPageEditBase
  implements OnInit {
  @Input() status_options: any[];
  @Input() cate_options: any[];
  isLoading = false;
  modelEdit: any = {};
  lesson_options: any = [];
  courseId: number = 0;
  lessonIds: any = [];
  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _coursesLessonService: CourseLessonsService,
    private _LessonsService: LessonsService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      lesson: [''],
    });
    await this.loadLessonOption();
  }

  async loadLessonOption() {
    this.lesson_options = [];
    await this._LessonsService.Gets(
      "",
      0,
      10000,
      "",
      false
    ).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.lesson_options.push({ label: value.name, value: value.id });
        });
      }

    }).catch(error => {
      this.isLoading = false;
      this._notifierService.showResponseError(error);
    });
  }

  save() {
    let form = [];
    this.lessonIds.forEach(x => {
      form.push({
        id: 0,
        idCourse: this.courseId,
        idLession: x
      });
    });

    this._coursesLessonService.SaveMulti(
      {
        idCourse: this.courseId,
        lstCourseLessions: form
      }).then(rs => {
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
    this.isShow = true;
    this.lessonIds = [];
    if (id > 0) {
      await this._coursesLessonService.GetById(id)
        .then(async response => {
          if (response.status) {
            response.data[0].lessions.forEach(x => {
              this.lessonIds.push(x.idLession);
            });
            this.courseId = response.data[0].idCourse;
          }
        }, () => {
          this._notifierService.showHttpUnknowError();
        });
    } else {
      this.modelEdit = {};
    }
  }
}



