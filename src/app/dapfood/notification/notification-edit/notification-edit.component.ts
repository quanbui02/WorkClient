import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
    selector: 'app-notification-edit',
    templateUrl: './notification-edit.component.html',
    styleUrls: ['./notification-edit.component.scss']
})
export class NotificationEditComponent extends SecondPageEditBase
    implements OnInit {
    total = 0;
    page = 1;
    limit = 100;
    limitAll = 10000;
    isLoading = false;
    type_options = [];
    key: string;
    results: any;
    selectedUsers = [];
    cols = [];

    modelEdit: any = {
        idCategory: 1,
    };

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _NotificationsService: NotificationsService,
        private _UserService: UserService
    ) {
        super(null, _injector);
    }

    ngOnInit() {
        this.loadType();
        this.formGroup = this.formBuilder.group({
            // code: new FormControl(''),
            // name: new FormControl('', Validators.compose([Validators.required])),
            type: [''],
            image: [''],
            title: [''],
            link: [''],
            key: [''],
            sendTo: [''],
            content: new FormControl('', Validators.compose([Validators.required])),
        });

        this.cols = [
            {
                field: 'userId',
                header: 'Mã',
                visible: true,
                align: 'center',
                width: '10%',
                sort: true,
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
                visible: true,
                width: '50%',
                sort: true
            },
        ];
    }
    async loadType() {
        this.type_options.push({ label: 'Gửi theo topic', value: 1 });
        this.type_options.push({ label: 'Gửi cho cá nhân', value: 2 });
    }
    save() {
        this.isLoading = true;
        if (this.modelEdit.type === 2) {
            if (this.selectedUsers === null) {
                this._notifierService.showError("Nhập người nhận");
                return false;
            }
            this.modelEdit.sendTo = this.selectedUsers.map(x => x.userId).join(',');
        }
        else {
            if (this.modelEdit.sendTo === null) {
                this._notifierService.showError("Nhập người nhận");
                return false;
            }
        }
        this._NotificationsService.post(this.modelEdit).then(rs => {
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
        this.modelEdit = {};
        this.selectedUsers = [];
        this.modelEdit.type = 1;
        if (id > 0) {
            await this._NotificationsService.getDetail(id)
                .then(async response => {
                    if (response.status) {
                        this.modelEdit = response.data;
                        if (this.modelEdit.type === 2) {
                            await this._UserService.GetByListId(this.modelEdit.sendTo).then(rs => {
                                if (rs.status) {
                                    this.selectedUsers = rs.data;
                                }
                            });
                        }
                    }
                }, () => {
                    this._notifierService.showHttpUnknowError();
                });
        }
    }
    async autoComplete(event) {
        const query = event.query;
        let ids = '';
        if (this.selectedUsers != null) {
            ids = this.selectedUsers.map((obj) => obj.userId).toString();
        }
        await this._UserService.AutoComplete(
            query,
            (this.page - 1) * this.limit,
            this.limit
        ).then(rs => {
            if (rs.status) {
                this.results = rs.data;
                this.total = rs.totalRecord;
            }
        });
    }

    onSelect(event) {
        if (this.selectedUsers.findIndex(rs => rs.userId === event.userId) < 0) {
            this.selectedUsers.push(event);
            this.key = null;
        } else {
            this._notifierService.showError('Người dùng này đã được chọn');
        }
    }
    onRemove(index: number): void {
        this.selectedUsers.splice(index, 1);
    }
}


