import { NewsCategoriesService } from './../../services/news-categories.service';
import { TagsService } from './../../services/tags.service';
import { NewsService } from './../../services/news.service';
import { FeedbacksService } from './../../services/feedback.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-news-edit',
  templateUrl: './news-edit.component.html',
  styleUrls: ['./news-edit.component.scss']
})
export class NewsEditComponent extends SecondPageEditBase
  implements OnInit {
  isLoading = false;
  modelEdit: any = {};
  dataTags: any = [];
  tag_options: any = [];
  cate_options: any = [];
  hideHtml = true;
  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _newsService: NewsService,
    private _tagsService: TagsService,
    private _newsCategoryService: NewsCategoriesService
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({
      description: [''],
      detail: [''],
      detailHtml: [''],
      name: [''],
      image: [''],
      tags: [''],
      idCategory: [''],
      descriptionSeo: [''],
      titleSeo: ['']
    });

    await this.loadTagsOption();
    await this.loadCategoriesOption();
  }


  async loadTagsOption() {

    await this._tagsService.Gets(
      '',
      0,
      1000,
      '',
      false
    ).then(rs => {
      if (rs.status) {
        this.dataTags = rs.data;
        if (this.dataTags.length > 0) {
          rs.data.forEach(value => {
            if (value.isActive) {
              this.tag_options.push({ label: value.tagName, value: value.id });
            }
          });
        }

      }
    });
  }

  async loadCategoriesOption() {
    await this._newsCategoryService.GetShort(0, '').then(rs => {
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
    this._newsService.Save(this.modelEdit).then(rs => {
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
      await this._newsService.GetByNewId(id)
        .then(async response => {
          if (response.status) {
            let tags = [];
            response.data.tags.forEach(x => {
              tags.push(x.tagId);
            });
            this.modelEdit = response.data.news;
            this.modelEdit = { ...this.modelEdit, tagIds: tags }
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