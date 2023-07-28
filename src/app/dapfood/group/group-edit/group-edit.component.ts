import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { GroupsService } from '../../services/groups.service';
import { User } from '../../../lib-shared/models/user';
import { UserService } from '../../../lib-shared/services/user.service';

@Component({
    selector: 'app-group-edit',
    templateUrl: './group-edit.component.html',
    styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent extends SecondPageEditBase
    implements OnInit {

    selectedItems = [];
    isLoading = false;
    type_options = [];
    users: any;
    user = new User();

    modelEdit: any = {
        idCategory: 1,
    };

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _GroupsService: GroupsService,
        private userService: UserService
    ) {
        super(null, _injector);
    }

    ngOnInit() {
        this.users = [];
        this.formGroup = this.formBuilder.group({
            code: [''],
            name: [''],
            link: [''],
            description: [''],
            users: [''],
            isPrivate: [''],
            isAutoApproved: [''],
            isActive: [''],
            avatar: ['']
        });
    }
    onSelect(event) {
        this.user = event;
    }
    async autoComplete(event) {
        const query = event.query;
        await this.userService.gets(query, -1, 0, 50).then(rs => {
            if (rs.status) {
                this.users = rs.data;
                this.users.forEach(item => {
                    item.fullDisplayName = item.name + '(' + item.userName + ')';
                });
            }
        });
    }
    save() {
        this.isLoading = true;
        if (this.user.userId) {
            this.modelEdit.userId = this.user.userId;
        } else {
            this.modelEdit.userId = null;
        }
        this._GroupsService.post(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isShow = false;
                this.closePopup.emit();
                this.modelEdit = {};
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.isLoading = false;
    }

    async showPopup(id: any) {
        this.isShow = true;
        if (id > 0) {
            await this._GroupsService.getDetail(id)
                .then(async response => {
                    if (response.status) {
                        this.modelEdit = response.data;
                        if (this.modelEdit.userId) {
                            this.userService.getDetail(this.modelEdit.userId).then(async rss => {
                                if (rss.status) {
                                    this.user = rss.data;
                                }
                            });
                        }
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        } else {
            this.modelEdit = {};
        }
    }

}


