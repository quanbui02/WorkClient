import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../lib-shared/models/user';
import { UserService } from '../../lib-shared/services/user.service';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { ConfigurationService } from '../../lib-shared/services/configuration.service';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { LessonsEditComponent } from './lessons-edit/lessons-edit.component';
import { LessonsService } from '../services/lessons.service';
import { QuestionLessonLessonDetailComponent } from '../questionLessions/questionLesson-lessonDetail/questionLesson-lessonDetail.component';
import { LessonRatesLessonComponent } from '../lessonRates/lessonRates-lesson/lessonRates-lesson.component';

@Component({
    selector: 'app-lessons',
    templateUrl: './lessons.component.html',
    styleUrls: ['./lessons.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LessonsComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        isActive: -1,
        type: -1
    };

    crrUser: User;
    vi: any;

    @ViewChild(LessonsEditComponent) _LessonsEditComponent: LessonsEditComponent;
    @ViewChild(QuestionLessonLessonDetailComponent) _QuestionLessonLessonDetailComponent: QuestionLessonLessonDetailComponent;
    @ViewChild(LessonRatesLessonComponent) _LessonRatesLessonComponent: LessonRatesLessonComponent;

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _UserService: UserService,
        private _LessonsService: LessonsService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        this.crrUser = await this._UserService.getCurrentUser();

        this.cols = [
            {
                field: 'image',
                header: 'Image',
                visible: true,
                width: '5%',
                sort: true
            },
            {
                field: 'name',
                header: 'Name',
                visible: true,
                sort: true
            },
            {
                field: 'institution',
                header: 'Tổ chức',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'instructor',
                header: 'Giảng viên',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'achievements',
                header: 'Những gì bạn sẽ học',
                visible: false,
                width: '20%',
                sort: true
            },
            {
                field: 'prerequisites',
                header: 'Yêu cầu học',
                visible: false,
                width: '20%',
                sort: true
            },
            {
                field: 'description',
                header: 'Mô tả',
                visible: false,
                width: '20%',
                sort: true
            },
            {
                field: 'objects',
                header: 'Đối tượng học',
                visible: false,
                width: '20%',
                sort: true
            },
            {
                field: 'difficultyLevel',
                header: 'Cấp độ',
                visible: false,
                width: '20%',
                sort: true
            },
            {
                field: 'certificate',
                header: 'Loại chứng nhận',
                visible: false,
                width: '20%',
                sort: true
            },
            {
                field: 'syllabus',
                header: 'Giáo trình',
                visible: false,
                width: '20%',
                sort: true
            },
            {
                field: 'totalTimeVideo',
                header: 'Tổng thời gian',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'totalPart',
                header: 'Tổng số học phần',
                visible: true,
                width: '10%',
                sort: true
            },

            {
                field: 'totalLesson',
                header: 'Tổng số bài giảng',
                visible: true,
                width: '10%',
                sort: true
            },
            {
                field: 'sumRate',
                header: 'Đánh giá',
                visible: true,
                width: '4%',
                sort: true,
                align: 'center',
            },
            {
                field: 'totalLike',
                header: 'Tổng số lượt thích',
                visible: false,
                width: '20%',
                sort: true
            },
            {
                field: 'totalComment',
                header: 'Tổng số lượt bình luận',
                visible: false,
                width: '20%',
                sort: true
            },
            {
                field: 'isActive',
                header: 'Sử dụng',
                visible: true,
                width: '5%',
                sort: true
            },
        ];

        await this.getData();
    }

    onCheckAll() {
        if (this.ids.length < this.dataSource.length) {
            this.isCheckAll = true;
            this.ids = [];
            for (let i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].checked = true;
                this.ids.push(this.dataSource[i].id);
            }
        } else {
            this.isCheckAll = false;
            this.ids = [];
            for (let i = 0; i < this.dataSource.length; i++) {
                this.dataSource[i].checked = false;
            }
        }
        this.isMultiEdit = this.ids.length > 0 ? true : false;
    }

    initDefaultOption() {
        this.searchModel.key = '';
    }

    onEdit(id: any) {
        this._LessonsEditComponent.showPopup(id);
    }
    onLessonQuestions(id: any) {
        this._QuestionLessonLessonDetailComponent.showPopup(id);
    }
    onlessonRates(id: any) {
        this._LessonRatesLessonComponent.showPopup(id);
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
            // await this._LessonsService.delete(id).then(re => {
            //     if (re.status) {
            //         this._notifierService.showDeleteDataSuccess();
            //         this.dataSource = this.dataSource.filter(obj => obj.id !== id);
            //     }
            // });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._LessonsService.Gets(
            this.searchModel.key,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                //console.log("du lieu bai giang=" + JSON.stringify(rs.data));
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        }).catch(error => {
            this.isLoading = false;
            this._notifierService.showResponseError(error);
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    onSearch() {
        this.getData();
    }

    toggleSearch() {
        super.toggleSearch();

        this.fixTableScrollProblem();
    }
    async onChangeRowLimit() {
        this.fixTableScrollProblem();
    }
    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    async fixTableScrollProblem() {
        await this.getData();
    }

    async onCloseForm() {
        this.getData();
    }
    IsActive(item: any, e) {
        const obj = {
            id: item.id,
            IsActive: e.checked
        };
        this._LessonsService.Active(obj).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
            } else {
                this._notifierService.showError(rs.message);
            }
            this.isLoading = false;
        });
    }
}
