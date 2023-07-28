import { filter } from 'rxjs/operators';
import { UserService } from './../../lib-shared/services/user.service';
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { WmTaskCommentsService } from '../services/WmTaskComments.service';
import { WmTaskCommentLikesService } from '../services/WmTaskCommentLikes.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent extends SecondPageIndexBase implements OnInit {
  @Input() idTask?: number;
  searchModel: any = {
    key: '',
    isActive: null,
    isDelete: false
  };
  crrUser: any;
  modelEdit: any = {
    id: 0,
    message: ''
  };

  message: string = '';
  lstUserName: string = "";
  updateComment: boolean[] = [false];
  showPopup: boolean[] = [];
  createComment: boolean = false;

  constructor(
    protected _injector: Injector,
    private _userService: UserService,
    private _WmTaskComments: WmTaskCommentsService,
    private _WmTaskCommentLikesService: WmTaskCommentLikesService,
  ) {
    super(null, _injector);
  }

  async ngOnInit() {
    this.crrUser = await this._userService.getCurrentUser();
    await this.getData();
  }

  async showData(idTask) {
    this.idTask = idTask;
    await this.getData();
  }

  async getData() {
    this.isLoading = true;
    await this._WmTaskComments.Gets(
      this.searchModel.key,
      this.idTask,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField,
      this.isAsc
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        this.total = rs.totalRecord;

        // this.dataSource.forEach(value => {
        //   let data = value.likeUser.filter(x => x.userId == this.crrUser.userId)[0];
        //   value = {
        //     ...value,
        //     userLiked: data ? true : false
        //   }
        // })

        this.resetUpdateForm();
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }

  onSave(type) {
    this.modelEdit.idTask = this.idTask;
    if (type == 0) this.modelEdit.message = this.message;
    this._WmTaskComments.Save(this.modelEdit).then(rs => {
      if (rs.status) {
        const index = this.dataSource.findIndex(s => s.id === rs.data.id);
        if (index >= 0) {
          this.dataSource[index] = {
            ...rs.data,
            countLike: this.dataSource[index].countLike,
            userLiked: this.dataSource[index].userLiked,
            likeUser: this.dataSource[index].likeUser
          };
        } else {
          this.dataSource.splice(0, 0, {
            ...rs.data,
            countLike: 0,
            userLiked: false,
            likeUser: []
          });
        }
        this._notifierService.showSuccess('Cập nhật thành công');

        this.onActiveInput();
        if (type == 1) {
          this.onCLoseEditorUpdate(index);
        }
      } else {
        this._notifierService.showError(rs.message);
      }
    });
    
  }

  async like(idTaskComment, idTask) {
    await this._WmTaskCommentLikesService.Like(idTaskComment, idTask)
      .then(async response => {
        if (response.status) {
          let index = this.dataSource.findIndex(x => x.id == idTaskComment);
          this.dataSource[index].userLiked = !response.data.isDeleted
          this.dataSource[index].countLike = !response.data.isDeleted ? this.dataSource[index].countLike + 1 : this.dataSource[index].countLike - 1;
          if (!response.data.isDeleted) {
            let arr = []
            arr = this.dataSource[index].likeUser;
            arr.push({
              userId: this.crrUser.userId,
              name: this.crrUser.name,
            })
            this.dataSource[index].likeUser = arr;
          }
          else {
            let indexUser = this.dataSource[index].likeUser.findIndex(x => x.userId == this.crrUser.userId);
            this.dataSource[index].likeUser.splice(indexUser, 1);
          }

        }
      }, () => {
        this._notifierService.showHttpUnknowError();
      });
  }

  async getDetail(id: any) {
    await this._WmTaskComments.GetDetail(id)
      .then(async response => {
        if (response.status) {
          this.modelEdit = response.data;
          // this.message = this.modelEdit.message;
        }
      }, () => {
        this._notifierService.showHttpUnknowError();
      });
  }

  onSearch() {
    this.getData();
  }

  onDelete(id: number) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._WmTaskComments.delete(id).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();
          this.dataSource = this.dataSource.filter(x => x.id !== id)
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  getAvatar(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/rocket.svg`;
  }
  getAvatarUser(avatar) {
    if (avatar != null)
      return this.getImageAvatar(avatar);
    else
      return `/assets/images/avatar.jpg`;
  }

  resetUpdateForm() {
    for (let i = 0; i < this.dataSource.length; i++) {
      this.updateComment[i] = false;
    }
  }

  onActiveEditor() {
    this.createComment = true;

    this.modelEdit.id = 0;
    this.message = "";
  }

  onActiveInput() {
    this.createComment = false;
    this.modelEdit.id = 0;
    this.message = "";
  }

  onActiveEditorUpdate(index, id) {
    this.resetUpdateForm();
    this.getDetail(id);
    this.updateComment[index] = true;
  }

  onCLoseEditorUpdate(index) {
    this.updateComment[index] = false;
    this.modelEdit = {
      idTask: 0,
      id: 0,
      message: ''
    };
  }

  // showPopupUserLike(index, idTaskComment) {
  //   let data = this.dataSource.filter(x => x.id = idTaskComment)[0];
  //   for (let i = 0; i < data.likeUser.length; i++) {
  //     if (i == data.likeUser.length - 1)
  //       this.lstUserName += `${data.likeUser[i]}`
  //     else
  //       this.lstUserName += `${data.likeUser[i]},`
  //   }
  // }

  // convertArrayToString(listItem: any[]) {
  //   let stringItem = "";
  //   for (let i = 0; i < listItem.length; i++) {
  //     if (i == listItem.length - 1)
  //       stringItem += `${listItem[i]}`
  //     else
  //       stringItem += `${listItem[i]},`
  //   }
  //   return stringItem;
  // }

}
