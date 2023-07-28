import { Component, Injector, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { ContentService } from '../../../services/contents.service';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-content-edit',
    templateUrl: './content-edit.component.html',
    styleUrls: ['./content-edit.component.scss']
})
export class ContentEditComponent extends SecondPageEditBase
    implements OnInit {
    @Input() isView = false;
    idProduct: number;
    status = -1;
    dataSource = [];
    // trangThai_options: any[] = [];
    listImage: any[] = [];
    countUnapproved = 0;
    viewPublic = true;
    viewPrivate = false;
    viewApproved = false;
    @Input() type = 1; // 1: DN; 2: CTV
    @Output() updateCount = new EventEmitter<any>();

    @ViewChild('fileUpload') fileUpload: FileUpload;

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _ContentService: ContentService,
        private _translateService: TranslateService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        // this.trangThai_options = [
        //     { label: '-- Trạng thái --', value: -1 },
        //     { label: 'Cá nhân', value: 0 },
        //     { label: 'Chờ duyệt', value: 1 },
        //     { label: 'Đã duyệt', value: 2 },
        //     { label: 'Từ chối', value: 3 }
        // ];

        // this.formGroup = this.formBuilder.group({
        //     content: ['', Validators.required],
        //     isActive: []
        // });
    }
    async getForView() {
        this.dataSource = [];
        this._ContentService.GetByIdProduct(this.idProduct)
            .then(async response => {
                this.dataSource = response.data;
            }, error => {
                this._notifierService.showHttpUnknowError();
            });
    }
    async getData() {
        this.dataSource = [];
        this._ContentService.Gets(this.idProduct, this.status, this.type)
            .then(async response => {
                this.dataSource = response.data;
            }, error => {
                this._notifierService.showHttpUnknowError();
            });
    }

    onAdd() {
        const obj = {
            idProduct: this.idProduct,
            status: 0,
            isEdit: true
        };
        if (this.type === 1) {
            obj.status = 2;
        }
        if (this.type === 2) {
            obj.status = 0;
        }
        this.dataSource.splice(0, 0, obj);
    }

    onEdit(item) {
        item.isEdit = true;
    }

    onSave(item: any) {
        item.type = this.type;
        if (item.type === 2) {
            item.status = 0;
        } else {
            item.status = 2;
        }
        this._ContentService.post(item).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isShow = true;
                rs.data.isEdit = false;
                this.dataSource = this.dataSource.filter(s => s.id > 0);
                var obj = this.dataSource.find(s => s.id == rs.data.id);
                if (obj == null) {
                    this.dataSource.unshift(rs.data);
                    rs.data.countUnapproved = this.countUnapproved + 1;
                    this.updateCount.emit(rs.data);
                } else {
                    obj = rs.data;
                }
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    onApproved(item: any, status: number) {
        item.status = status;
        this._ContentService.post(item).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isShow = true;

                if (this.countUnapproved > 0) {
                    this.countUnapproved = this.countUnapproved - 1;
                    rs.data.countUnapproved = this.countUnapproved;
                    this.updateCount.emit(rs.data);
                }
                this.getData();
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Bạn có chắc chắn muốn xóa bản ghi ?', 'Bạn có chắc muốn xóa thiết lập này?').then(rs => {
            this._ContentService.delete(id).then(rs => {
                if (rs.status) {
                    this.getData();
                    this.countUnapproved -= 1;
                    rs.data.countUnapproved = this.countUnapproved;
                    this.updateCount.emit(rs.data);
                    this._notifierService.showDeleteDataSuccess();
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    async showPopup(data: any = {}) {
        this.viewPublic = true;
        this.viewPrivate = false;
        this.viewApproved = false;
        this.isShow = true;
        this.idProduct = data.id;
        if (data.countUnapproved) {
            this.countUnapproved = data.countUnapproved;
        }
        if (data.type) {
            this.type = data.type;
        }
        this.getForView();
    }

    onChangeType() {

    }
}
