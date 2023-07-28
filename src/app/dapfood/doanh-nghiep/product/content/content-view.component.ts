import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ContentService } from '../../../services/contents.service';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';

@Component({
    selector: 'app-content-view',
    templateUrl: './content-view.component.html',
    styleUrls: ['./content-view.component.scss']

})
export class ContentViewComponent extends SecondPageEditBase
    implements OnInit {
    idProduct: number;
    viewdn = true;
    viewctv = true;
    dataSource = [];
    listImage: any[] = [];
    title = 'Thêm/Sửa nội dung quảng cáo';
    @ViewChild('fileUpload') fileUpload: FileUpload;

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _ContentService: ContentService,
        private messageService: MessageService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        // this.formGroup = this.formBuilder.group({
        //     content: ['', Validators.required],
        //     isActive: []
        // });
    }

    async getData() {
        this.dataSource = [];
        this._ContentService.GetByIdProduct(this.idProduct)
            .then(async response => {
                this.dataSource = response.data;
            }, error => {
                this._notifierService.showHttpUnknowError();
            });
    }

    onAdd() {
        const obj = {
            idProduct: this.idProduct,
            isEdit: true
        };
        this.dataSource.splice(0, 0, obj);
    }

    onEdit(item) {
        item.isEdit = true;
    }

    onSave(item: any) {
        this._ContentService.post(item).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isShow = true;
                this.getData();
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Bạn có chắc chắn muốn xóa bản ghi ?', 'Bạn có chắc muốn xóa thiết lập này?').then(rs => {
            this._ContentService.delete(id).then(re => {
                if (re.status) {
                    this.getData();
                    this._notifierService.showDeleteDataSuccess();
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    async showPopup(idProduct: number) {
        this.title = 'Nội dung quảng cáo';
        this.isShow = true;
        this.idProduct = idProduct;
        this.getData();
    }

}

