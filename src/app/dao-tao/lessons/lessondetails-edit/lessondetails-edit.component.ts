import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { LessonDetailsService } from '../../services/lessondetails.service';

@Component({
    selector: 'app-lessondetails-edit',
    templateUrl: './lessondetails-edit.component.html',
    styleUrls: ['./lessondetails-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LessonDetailsEditComponent extends SecondPageEditBase
    implements OnInit {
    key: string;
    isLoading = false;
    modelEdit: any = {
        idCategory: 1,
    };

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _LessonDetailsService: LessonDetailsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.formGroup = this.formBuilder.group({
            idLession: [''],
            idPartLession: [''],
            displayLesson: [''],
            name: [''],
            description: [''],
            lessonVideo: [''],
            lessonFile: [''],
            sort: [''],
            isActive: [''],
            isDeleted: [''],
            createdUserId: [''],
            createdDate: [''],
            updatedUserId: [''],
            updatedDate: [''],
            deletedUserId: [''],
            deletedDate: [''],
        });
    }

    save() {
        this._LessonDetailsService.post(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess('Cập nhật thành công');
                this.isShow = false;
                this.closePopup.emit();
                this.modelEdit = {};
            } else {
                this._notifierService.showError(rs.message);
            }
        }).catch(error => {
            this._notifierService.showResponseError(error);
        });
    }

    async showPopup(id: any) {
        this.isShow = true;
        if (id > 0) {
            await this._LessonDetailsService.getDetail(id).then(async response => {
                if (response.status) {
                    this.modelEdit = response.data;
                }
            }, (error) => {
                this._notifierService.showResponseError(error);
            });
        } else {
            this.modelEdit = {
                isActive: true
            };
        }
    }

}


