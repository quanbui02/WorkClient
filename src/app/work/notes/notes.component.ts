import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { WmNoteService } from '../services/WmNote.service';
import { async } from '@angular/core/testing';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { NotesEditComponent } from './notes-edit/notes-edit.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends SecondPageIndexBase implements OnInit {
  idProject: number;
  idParent: number;
  myTask: boolean = false;
  modelEdit: any = {
    name: "",
    detail: "",
    isStar: false
  };
  inputNote: boolean = false;
  countData: any[] = [0, 0, 0, 0, 0];
  dataSourceArray: any[];
  arrayItem: any[];

  ref: DynamicDialogRef;
  color: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    protected _injector: Injector,
    private _WmNoteService: WmNoteService,
    public dialogService: DialogService,
    private router: Router,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {

    this.activatedRoute.params.subscribe(async params => {
      this.idProject = parseInt(params['id']);
      this.idParent = parseInt(params['idParent']);
      if (this.router.url.includes("group-task") == false)
        this.myTask = true;
    });

    this.getData();
  }

  // async drop(event: CdkDragDrop<any>) {
  //   moveItemInArray(this.tiles, event.previousIndex, event.currentIndex);
  // }
  // drop(event: CdkDragDrop<any>) {
  //   this.tiles[event.previousContainer.data.index] = event.container.data.item;
  //   this.tiles[event.container.data.index] = event.previousContainer.data.item;
  // }
  async getData() {
    this.isLoading = true;
    this.isAsc = true;
    await this._WmNoteService.Gets(
      "",
      this.idProject,
      0,
      1000000,
      "sort",
      false
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
      }
    });
    this.changeDataListToArray();
    this.resetBulkSelect();
    this.isLoading = false;
  }
  changeDataListToArray() {
    this.countData = [0, 0, 0, 0, 0];
    let dataSort = Array.from(this.countData);
    this.dataSourceArray = [];

    if (this.dataSource.length >= 5) this.arrayItem = [[], [], [], [], []];
    else if (this.dataSource.length >= 4) this.arrayItem = [[], [], [], []];
    else if (this.dataSource.length >= 3) this.arrayItem = [[], [], []];
    else if (this.dataSource.length >= 2) this.arrayItem = [[], []];
    else if (this.dataSource.length >= 1) this.arrayItem = [[]];

    for (let i = 0; i < this.dataSource.length; i++) {
      if (this.countData[0] == dataSort.sort(function (a, b) { return a - b })[0]) {
        this.arrayItem[0].push(this.dataSource[i]);
        this.countData[0]++;
        dataSort[0]++;
      }
      else if (this.countData[1] == dataSort.sort(function (a, b) { return a - b })[0]) {
        this.arrayItem[1].push(this.dataSource[i])
        this.countData[1]++;
        dataSort[0]++;
      }
      else if (this.countData[2] == dataSort.sort(function (a, b) { return a - b })[0]) {
        this.arrayItem[2].push(this.dataSource[i])
        this.countData[2]++;
        dataSort[0]++;
      }
      else if (this.countData[3] == dataSort.sort(function (a, b) { return a - b })[0]) {
        this.arrayItem[3].push(this.dataSource[i])
        this.countData[3]++;
        dataSort[0]++;
      }
      else if (this.countData[4] == dataSort.sort(function (a, b) { return a - b })[0]) {
        this.arrayItem[4].push(this.dataSource[i])
        this.countData[4]++;
        dataSort[0]++;
      }
    }

    for (let i = 0; i < this.arrayItem.length; i++) {
      this.dataSourceArray.push({
        id: i + 1,
        dataItem: this.arrayItem[i]
      });
    }
  }

  async drop(event: CdkDragDrop<any>, idCol: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    let position = (this.dataSourceArray.length) * event.currentIndex + (idCol - 1)
    let obj = event.container.data[event.currentIndex]

    await this._WmNoteService.ChangeSort(obj.id, position).then(rs => {
      if (rs.status) {
        this.updateData(rs.data, 1);
      }
    });
  }

  async save() {
    if (this.modelEdit.name || this.modelEdit.detail) {
      this.modelEdit.idProject = this.idProject;
      await this._WmNoteService.Save(this.modelEdit).then(async rs => {
        if (rs.status) {
          this.modelEdit = {
            name: "",
            detail: "",
            isStar: false
          };
          this.updateData(rs.data, 1);

        } else {
          this._notifierService.showError(rs.message);
        }
      });
    }
    this.inputNote = false
  }

  async onChangeStar(id) {
    await this._WmNoteService.changeStar(id).then(async rs => {
      if (rs.status) {
        this.updateData(rs.data, 1);
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

  getDetail(id) {
    //this.popupEdit.showPopupTask(id, idStatus);
    this.ref = this.dialogService.open(NotesEditComponent, {
      data: {
        id: id,
      },
      showHeader: false,
      header: '',
      width: '50%',
      height: 'calc(100vh - 80px)',
      styleClass: "vs-modal",
      contentStyle: { 'overflow': 'auto' }, //'max-height': 'calc(100vh - 180px);', 
      baseZIndex: 1001,
      closeOnEscape: true
    });

    this.ref.onClose.subscribe((re: any) => {
      if (re != null) {
        this.updateData(re, 1);
      }
    });
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(async rs => {
      await this._WmNoteService.Delete(id).then(re => {
        if (re.status) {
          this.updateData(re.data, 2);
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  async onChangeColor(id, event) {
    await this._WmNoteService.ChangeBgColor(id, event.value).then(re => {
      if (re.status) {
        // this.updateData(re.data, 1);
      }
    });
  }

  updateData(value, type) {
    if (type == 1) { //save data 
      let index = this.dataSource.findIndex(x => x.id == value.id);
      if (index >= 0) this.dataSource[index] = value;
      else this.dataSource.splice(0, 0, value);
    }
    else if (type == 2) { //delete
      let index = this.dataSource.findIndex(x => x.id == value.id);
      this.dataSource.splice(index, 1);
    }

    this.dataSource = this.dataSource.sort(function (x, y) { return y.sort - x.sort });
    this.changeDataListToArray();
  }
}
