import { Component, OnInit, Input, ViewEncapsulation, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { WmTasksService } from '../../services/WmTasks.service';
import { Status } from '../../work.enum';
import { TaskEditComponent } from '../../task-edit/task-edit.component';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';

@Component({
  selector: '[app-board-column]',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BoardColumnComponent extends SecondPageIndexBase implements OnInit {
  @Input() taskList: any;
  @Input() idProject?: number;
  @Input() hideBtnDetail: boolean;
  @Output() changeData = new EventEmitter<any>();
  createdIssue: number = 0;
  ref: DynamicDialogRef;

  constructor(
    protected _injector: Injector,
    private _WmTasksService: WmTasksService,
    public dialogService: DialogService,
  ) {
    super(null, _injector);
  }

  ngOnInit() {
  }

  async drop(event: CdkDragDrop<any>, id) {
    let isMovingInsideTheSameList = event.previousContainer === event.container;
    if (isMovingInsideTheSameList) { // Sắp xếp cùng cột
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else { // Sắp xếp khác cột
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    let obj = event.container.data[event.currentIndex]
    let sort = 0;
    let type = 0;
    let objSort = {
      id: 0,
      sort: 0
    };
    if (event.currentIndex == 0) {
      objSort = event.container.data[event.currentIndex + 1]
      type = 1;
    }
    else if (event.currentIndex == event.container.data.length - 1) {
      objSort = event.container.data[event.currentIndex - 1]
      type = 2;
    }
    else {
      let objAfter = event.container.data[event.currentIndex + 1]
      let objBefore = event.container.data[event.currentIndex - 1]
      sort = (objBefore.sort + objAfter.sort) / 2;
    }
    await this._WmTasksService.ChangeSortColumn(obj.id, sort, objSort ? objSort.id : 0, id, type).then(rs => {
      if (rs.status) {
        if (rs.data.idStatus == Status.Done) {
          obj.percent = 100;
          obj.completed = true;
        }
        obj.idStatus = rs.data.idStatus;
      }
    });
  }

  getDetail(id, idProjectCol) {
    //this.popupEdit.showPopupTask(id, idStatus);
    this.ref = this.dialogService.open(TaskEditComponent, {
      data: {
        id: id,
        idProjectCol: idProjectCol,
        idProject: this.idProject
      },
      showHeader: false,
      header: '',
      width: '95%',
      height: 'calc(100vh - 50px)',
      styleClass: "vs-modal",
      contentStyle: { 'overflow': 'auto' }, //'max-height': 'calc(100vh - 180px);', 
      baseZIndex: 1001,
      closeOnEscape: true
    });

    this.ref.onClose.subscribe((re: any) => {
      if (re != null) {
        this.isLoading = false;
        this.changeData.emit(this.createdIssue);
      }
    });

  }

  async hideOpenFormCreate(idStatus) {
    if (this.createdIssue == idStatus) this.createdIssue = 0;
    else this.createdIssue = idStatus;
  }

  onCloseForm() {
    this.getData();
  }

  hideCreateIssue() {
    this.changeData.emit(this.createdIssue);
  }
}
