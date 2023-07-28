import { SecondPageEditBase } from './../../../lib-shared/classes/base/second-page-edit-base';
import { LessonRatesService } from './../../services/lessonRates.service';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';

@Component({
  selector: 'app-lessonRates-lesson',
  templateUrl: './lessonRates-lesson.component.html',
  styleUrls: ['./lessonRates-lesson.component.scss']
})
export class LessonRatesLessonComponent extends SecondPageEditBase
  implements OnInit {
  isLoading = false;
  modelEdit: any = {};
  page = 1;
  limit = 100;
  dataSource: any = [];
  total = 0;
  // listItemNumberPerPage = [
  //   20, 50, 100, 200, 1000
  // ];
  listItemNumberPerPage = [
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '200', value: 200 },
    { label: '500', value: 500 },
    { label: '1000', value: 1000 },
  ];
  idLesson = 0;
  constructor(
    protected _injector: Injector,
    private _lessonRatesService: LessonRatesService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {

  }

  async showPopup(id: any) {
    this.isLoading = true;
    this.dataSource = [];
    this.idLesson = id;
    await this._lessonRatesService.Gets(
      "", -1, id, null, null, (this.page - 1) * this.limit, this.limit, "", false, true).then(rs => {
        if (rs.status) {
          this.dataSource = rs.data;
          this.total = rs.totalRecord;
          console.log("data Source: " + JSON.stringify(this.dataSource))
        }

      });

    this.isLoading = false;
    this.isShow = true;

  }

  async onPage(event: any) {
    this.page = (event.first / event.rows) + 1;
    this.limit = event.rows;
    await this.showPopup(this.idLesson);
  }

  async onChangeRowLimit() {
    await this.showPopup(this.idLesson);
  }

  // onChangeRowLimit(event) {
  //   this.limit = event.rows;
  //   this.page = event.page;
  //   this._lessonRatesService.Gets(
  //     "", -1, this.idLesson, null, null, (this.page) * this.limit, this.limit, "", false, true).then(rs => {
  //       if (rs.status) {
  //         this.dataSource = rs.data;
  //         this.total = rs.totalRecord;
  //       }
  //     });
  // }

}