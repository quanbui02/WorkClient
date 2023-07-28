import { LessonsService } from './../../../dao-tao/services/lessons.service';
import { PathologiesService } from './../../services/Pathologies.service';
import { PathologiesCategoryService } from './../../services/PathologiesCategory.service';
import { NewsCategoriesService } from './../../services/news-categories.service';
import { TagsService } from './../../services/tags.service';
import { NewsService } from './../../services/news.service';
import { FeedbacksService } from './../../services/feedback.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-Pathologies-edit',
  templateUrl: './Pathologies-edit.component.html',
  styleUrls: ['./Pathologies-edit.component.scss']
})
export class PathologiesEditComponent extends SecondPageEditBase
  implements OnInit {
  isLoading = false;
  modelEdit: any = {};
  dataTags: any = [];
  // tag_options: any = [];
  cate_options: any = [];
  hideHtml = true;
  lessonIds: any = [];
  idPathology: number = 0;
  lesson_options: any = [];
  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _PathologiesService: PathologiesService,
    private _tagsService: TagsService,
    private _pathologiesCategoryService: PathologiesCategoryService,
    private _LessonsService: LessonsService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      description: [''],
      detail: ['', Validators.required],
      detailHtml: [''],
      name: ['', Validators.required],
      image: ['', Validators.required],
      tags: [''],
      lesson: [''],
      idCategory: ['', Validators.required],
      // descriptionSeo: [''],
      // titleSeo: ['']
    });

    await this.loadLessonOption();
    await this.loadCategoriesOption();
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

  async loadCategoriesOption() {
    await this._pathologiesCategoryService.GetShort(0, '').then(rs => {
      if (rs.status) {
        rs.data.forEach(item => {
          item.label = item.name;
          item.value = item.id;
        });
        this.cate_options = rs.data;
      }
    });
  }

  save() {
    let form = [];
    this.lessonIds.forEach(x => {
      form.push({
        id: 0,
        idPathology: this.idPathology,
        idLession: x
      });
    });
    this.modelEdit = { ...this.modelEdit, lessionPathologies: form }
    this._PathologiesService.Save(this.modelEdit).then(rs => {
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
    this.idPathology = id;
    if (id > 0) {
      await this._PathologiesService.GetByPathologyId(id)
        .then(async response => {
          if (response.status) {
            this.lessonIds = [];
            if (response.data.lessionPathologies) {
              response.data.lessionPathologies.forEach(x => {
                this.lessonIds.push(x.idLession);
              });
            }
            this.modelEdit = response.data;
            console.log(JSON.stringify(this.modelEdit))
            // this.modelEdit = { ...this.modelEdit, tagIds: tags }
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