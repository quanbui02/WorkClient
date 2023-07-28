import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PathologiesService } from '../../../dapfood/services/Pathologies.service';
import { ProductService } from '../../../dapfood/services/products.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { CoursesService } from '../../services/courses.service';
import { LessonDetailsService } from '../../services/lessondetails.service';
import { LessonsService } from '../../services/lessons.service';
import { LessonDetailsEditComponent } from '../lessondetails-edit/lessondetails-edit.component';

@Component({
    selector: 'app-lessons-edit',
    templateUrl: './lessons-edit.component.html',
    styleUrls: ['./lessons-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LessonsEditComponent extends SecondPageEditBase
    implements OnInit {
    key: string;
    isLoading = false;
    modelEdit: any = {
        idCategory: 1,
    };
    hideHtml = true;
    dataSource = [];
    lsdelete_lessonDetail: any = [];
    product_options: any[] = [];
    lessionProducts: any[] = [];

    courses_options: any[] = [];
    lessionCourses: any[] = [];

    // Pathologies_options: any[] = [];
    // lessionPathologies: any[] = [];

    @ViewChild(LessonDetailsEditComponent) _LessonDetailsEditComponent: LessonDetailsEditComponent;

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _LessonsService: LessonsService,
        //private _LessonDetailsService: LessonDetailsService,
        private _UserService: UserService,
        private formBuilderlessonDetail: FormBuilder,
        private _ProductService: ProductService,
        private _CoursesService: CoursesService,
        // private _PathologiesService: PathologiesService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {

        this.formGroup = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])],
            image: [''],
            institution: [''],
            instructor: [''],
            achievements: [''],
            prerequisites: [''],
            description: [''],
            objects: [''],
            difficultyLevel: [''],
            certificate: [''],
            syllabus: [''],
            totalTimeVideo: [''],
            totalPart: [''],
            totalLesson: [''],
            totalLike: [''],
            totalComment: [''],
            sort: [''],
            isActive: [''],
            isDeleted: [''],
            createdUserId: [''],
            createdDate: [''],
            updatedUserId: [''],
            updatedDate: [''],
            deletedUserId: [''],
            deletedDate: [''],
            lessionProducts: [],
            lessionCourses: [],
            // lessionPathologies: [],
        });
    }

    async save() {
        this.modelEdit.lessonDetails = [];
        this.modelEdit.courseLessions = [];
        this.modelEdit.lessionProducts = [];
        // this.modelEdit.lessionPathologies = [];
        this.modelEdit.lessonDetails = this.formlessonDetails.value.lessonDetails;

        // danh sách khóa học liên quan
        let lsLessionCourses = [];
        this.lessionCourses.forEach(x => {
            lsLessionCourses.push({
                id: 0,
                idCourse: x,
                idLession: this.modelEdit.id
            });
        });
        this.modelEdit.courseLessions = lsLessionCourses;

        //danh sách sản phẩm liên quan
        let lslessionProducts = [];
        this.lessionProducts.forEach(x => {
            lslessionProducts.push({
                id: 0,
                IdProduct: x,
                idLession: this.modelEdit.id
            });
        });
        this.modelEdit.lessionProducts = lslessionProducts;

        // //danh sách sản phẩm liên quan
        // let lslessionPathologies = [];
        // this.lessionPathologies.forEach(x => {
        //     lslessionPathologies.push({
        //         id: 0,
        //         idPathology: x,
        //         idLession: this.modelEdit.id
        //     });
        // });
        // this.modelEdit.lessionPathologies = lslessionPathologies;
        //console.log("Noi dung cap nhat =" + JSON.stringify(this.modelEdit))

        await this._LessonsService.post(this.modelEdit).then(rs => {
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
        this.lsdelete_lessonDetail = [];
        this.lessionCourses = [];
        this.lessionProducts = [];
        // this.lessionPathologies = [];
        await this.loadProduct();
        await this.loadCourses();
        // await this.loadPathologies();
        while (this.lessonDetailsFieldAsFormArray.length) {
            this.lessonDetailsFieldAsFormArray.removeAt(0);
        }
        this.isShow = true;
        if (id > 0) {

            await this._LessonsService.GetDetailById(id).then(async response => {
                if (response.status) {
                    //console.log('chi tiet khoa hoc' + JSON.stringify(response.data));
                    this.modelEdit = response.data;
                    // danh sách nội dung bài giảng cần cập nhật
                    if (this.modelEdit.lessonDetails.length > 0) {
                        this.modelEdit.lessonDetails.forEach(item => {
                            this.lessonDetailsFieldAsFormArray.push(this.EditlessonDetail(item));
                        });
                    }
                    // danh sách khóa học cần cập nhật
                    if (this.modelEdit.courseLessions.length > 0) {
                        this.modelEdit.courseLessions.forEach(item => {
                            this.lessionCourses.push(item.idCourse);
                        });
                    }
                    //danh sách sản phẩm liên quan cập nhật
                    if (this.modelEdit.lessionProducts.length > 0) {
                        this.modelEdit.lessionProducts.forEach(item => {
                            this.lessionProducts.push(item.idProduct);
                        });
                    }
                    // //danh sách bệnh học liên quan cập nhật
                    // if (this.modelEdit.lessionPathologies.length > 0) {
                    //     this.modelEdit.lessionPathologies.forEach(item => {
                    //         this.lessionPathologies.push(item.idPathology);
                    //     });
                    // }
                }
            }, (error) => {
                this._notifierService.showResponseError(error);
            });
        } else {
            this.addControl();
            this.modelEdit = {
                isActive: true
            };
        }
    }
    // danh sách sản phầm
    async loadProduct() {
        this.lessionProducts = [];
        this.product_options = [];
        await this._ProductService.GetsByIdClient("", 0, 1, 0, 1000).then(rs => {
            if (rs.status) {
                //console.log("danh muc san pham = " + JSON.stringify(rs.data));
                rs.data.forEach(item => {
                    this.product_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }
    //danh sách khóa học
    async loadCourses() {
        this.lessionCourses = [];
        this.courses_options = [];
        await this._CoursesService.Gets("", 0, 1000).then(rs => {
            if (rs.status) {
                //console.log('danh sach khoa học = ' + JSON.stringify(rs.data));
                rs.data.forEach(item => {
                    this.courses_options.push({ label: item.name, value: item.id });
                });
            }
        });
    }
    // //danh sách bệnh học
    // async loadPathologies() {
    //     this.Pathologies_options = [];
    //     this.lessionPathologies = [];
    //     await this._PathologiesService.Gets("", -1, null, null, 0, 1000).then(rs => {
    //         if (rs.status) {
    //             console.log('danh sach bện học = ' + JSON.stringify(rs.data));
    //             rs.data.forEach(item => {
    //                 this.Pathologies_options.push({ label: item.name, value: item.id });
    //             });
    //         }
    //     });
    // }

    ShowHideHtml() {
        this.hideHtml = !this.hideHtml;
    }


    async showAddAddress() {
        this.dataSource.push(this.dataSource.length);
        // this._LessonDetailsEditComponent.showPopup(0);
    }
    async onCloseForm() {
    }

    //form lesson Detail dynamically 
    formlessonDetails = this.formBuilderlessonDetail.group({
        lessonDetails: this.formBuilderlessonDetail.array([]),
    });

    lessonDetail(): any {
        return this.formBuilderlessonDetail.group({
            id: this.formBuilderlessonDetail.control(0),
            idLession: this.formBuilderlessonDetail.control(''),
            imageLessionDetail: this.formBuilderlessonDetail.control(''),
            descriptionDetail: this.formBuilderlessonDetail.control(''),
            name: this.formBuilderlessonDetail.control(''),
            description: this.formBuilderlessonDetail.control(''),
            lessonVideo: this.formBuilderlessonDetail.control(''),
            timeVideo: this.formBuilderlessonDetail.control(0),
            lessonFile: this.formBuilderlessonDetail.control(''),
            isActive: this.formBuilderlessonDetail.control(true),
            sort: this.formBuilderlessonDetail.control(0),
        });
    }

    EditlessonDetail(item: any): any {
        return this.formBuilderlessonDetail.group({
            id: this.formBuilderlessonDetail.control(item.id),
            idLession: this.formBuilderlessonDetail.control(item.idLession),
            imageLessionDetail: this.formBuilderlessonDetail.control(item.imageLessionDetail),
            name: this.formBuilderlessonDetail.control(item.name),
            description: this.formBuilderlessonDetail.control(item.description),
            descriptionDetail: this.formBuilderlessonDetail.control(item.descriptionDetail),
            lessonVideo: this.formBuilderlessonDetail.control(item.lessonVideo),
            timeVideo: this.formBuilderlessonDetail.control(item.timeVideo),
            lessonFile: this.formBuilderlessonDetail.control(item.lessonFile),
            isActive: this.formBuilderlessonDetail.control(item.isActive),
            sort: this.formBuilderlessonDetail.control(item.sort),
        });
    }
    get lessonDetailsFieldAsFormArray(): any {
        return this.formlessonDetails.get('lessonDetails') as FormArray;
    }
    async addControl() {
        this.lessonDetailsFieldAsFormArray.push(this.lessonDetail());
    }
    async remove(i: number) {
        //console.log("nội dung cần xóa : " + JSON.stringify(this.lessonDetailsFieldAsFormArray.at(i).value));
        let lessonDetaildel = this.lessonDetailsFieldAsFormArray.at(i).value;

        if (lessonDetaildel.id > 0) {
            this.lsdelete_lessonDetail.push(lessonDetaildel.id);
        }
        this.lessonDetailsFieldAsFormArray.removeAt(i);

    }
    async formValue() {
        console.log(this.formlessonDetails.value);
    }
}


