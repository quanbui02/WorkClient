import { Component, Injector, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { MessageService, TreeNode } from 'primeng/api';
import { ProductService } from '../../../services/products.service';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';

@Component({
    selector: 'app-admin-approve-comment',
    templateUrl: './admin-approve-comment.component.html',
    styleUrls: ['./admin-approve-comment.component.scss']
})
export class AdminApproveCommentComponent extends SecondPageEditBase
    implements OnInit {
    categories: TreeNode[];
    selectedCategories: TreeNode[] = [];
    modelEdit: any = {
    };
    listImage: any[] = [];
    dropdownCategories: any[];

    @ViewChild('fileUpload') fileUpload: FileUpload;
    @Input() isView = false;

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _ProductService: ProductService,
    ) {
        super(null, _injector);
        this.formGroup = this.formBuilder.group({
            messageApprove: ['']
        });
    }

    async ngOnInit() {
    }

    save() {
        this._ProductService.SaveComment(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
                this.isShow = false;
                this.closePopup.emit();
            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    async showPopup(item: any = {}) {
        this.isShow = true;
        //this.modelEdit = data;

        await this._ProductService.getDetail(item.id).then(async rs => {
            if (rs.status) {
                this.modelEdit = rs.data;

                this.modelEdit.messageApprove = this.modelEdit.messageApprove;
            }
        }, error => {
            this._notifierService.showHttpUnknowError();
        });

    }
}