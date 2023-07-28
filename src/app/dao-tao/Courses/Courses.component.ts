import { LessonsService } from './../services/lessons.service';
import { CoursesLessonComponent } from './Courses-lesson/Courses-lesson.component';
import { CoursesService } from './../services/courses.service';
import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';

@Component({
  selector: 'app-Courses',
  templateUrl: './Courses.component.html',
  styleUrls: ['./Courses.component.scss']
})
export class CoursesComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: ''
  };
  dataTree: any = [];
  menuItems: any = [
    // { label: 'Thêm con', icon: 'pi pi-fw pi-plus', command: (event) => this.onEdit(0, this.selectedTreeNode.data) },
    { label: 'Thêm cùng cấp', icon: 'pi pi-fw pi-plus', command: (event) => this.onEdit(0) },
    { label: 'Thêm bài giảng', icon: 'pi pi-fw pi-pencil', command: (event) => this.showPopup(this.selectedTreeNode.data) },
    { label: 'Xóa', icon: 'pi pi-fw pi-trash', command: (event) => this.onDelete(this.selectedTreeNode) },
  ];
  selectedTreeNode: any;
  modelEdit: any = {
    isActive: true,
    idParent: 0
  };
  dropdownCategories: any[];
  lesson_options: any = [];
  courseId: number = 0;
  lessonIds: any = [];


  formGroup: FormGroup = new FormGroup({});

  @ViewChild(CoursesLessonComponent) _coursesLessonComponent: CoursesLessonComponent;
  // hideHtmlFooterSeo = true;
  // hideHtmlHeaderSeo = true;
  // @ViewChild(CategoryEditComponent) _CategoryEditComponent: CategoryEditComponent;

  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _coursesService: CoursesService,
    private _LessonsService: LessonsService,
  ) {
    super(null, _injector);
    this.formGroup = this.formBuilder.group({
      name: [''],
      // idParent: [''],
      // image: [''],
      lesson: [''],
      isActive: [''],
      key: [''],
      sort: [''],
    });
  }

  async ngOnInit() {
    //this.loadTableColumnConfig();
    // await this.onLoadCategories();
    await this.getData();
    await this.loadLessonOption();
  }

  // async onLoadCategories() {
  //   this.dropdownCategories = [{ label: '-- Danh mục gốc --', value: 0 }];
  //   await this._pathologyCategoriesServices.searchDropdown('').then(rs => {
  //     console.log(JSON.stringify(rs.data))
  //     rs.data.forEach(value => {
  //       this.dropdownCategories.push(value);
  //     });
  //   });

  // }

  async loadLessonOption() {
    this.lesson_options = [];
    await this._LessonsService.Gets(
      "",
      0,
      10000,
      "",
      false
    ).then(rs => {
      if (rs.status) {
        rs.data.forEach(value => {
          this.lesson_options.push({ label: value.name, value: value.id });
        });
      }

    }).catch(error => {
      this.isLoading = false;
      this._notifierService.showResponseError(error);
    });
  }

  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._coursesService.Gets(
      this.searchModel.key,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;

        this.dataSource.forEach(s => {
          let obj = {
            label: s.name,
            data: s.id,
            idParent: s.idParent,
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
            children: []
          };
          // this.dataSource.filter(x => x.idParent == s.id).forEach(s1 => {
          //   let obj1 = {
          //     label: s1.name,
          //     data: s1.id,
          //     idParent: s1.idParent,
          //     expandedIcon: "pi pi-folder-open",
          //     collapsedIcon: "pi pi-folder",
          //     children: []
          //   };
          //   this.dataSource.filter(x => x.idParent == s1.id).forEach(s2 => {
          //     let obj2 = {
          //       label: s2.name,
          //       data: s2.id,
          //       idParent: s2.idParent,
          //       expandedIcon: "pi pi-image",
          //       collapsedIcon: "pi pi-folder",
          //     };
          //     obj1.children.push(obj2);
          //   })
          //   obj.children.push(obj1);
          // })
          this.dataTree.push(obj);
        })

        this.total = rs.totalRecord;
      }
    });
    //this.resetBulkSelect();
    this.isLoading = false;
  }

  onSearch() {
    this.getData();
  }

  onEdit(id: any) {
    this.modelEdit = {
      // idParent: idParent,
      isActive: true
    };
    this.lessonIds = [];
    this.courseId = 0;
  }
  onTreeClick(item) {
    //this._CategoryEditComponent.showPopup(item.data);
  }

  async nodeSelect(event) {
    this.lessonIds = [];
    if (this.selectedTreeNode.data > 0) {
      await this._coursesService.GetById(this.selectedTreeNode.data)
        .then(async response => {
          if (response.status) {
            this.modelEdit = response.data[0];
            response.data[0].courseLessions.forEach(x => {
              this.lessonIds.push(x.idLession);
            });
            this.courseId = response.data[0].id;
            console.log(JSON.stringify(this.lessonIds))
          }
        }, () => {
          this._notifierService.showHttpUnknowError();
        });
    } else {
      this.modelEdit = {
        isActive: true
      };
    }
  }

  save() {
    let form = [];
    this.lessonIds.forEach(x => {
      form.push({
        id: 0,
        idCourse: this.courseId,
        idLession: x
      });
    });
    this.modelEdit = { ...this.modelEdit, courseLessions: form }
    this._coursesService.post(this.modelEdit).then(rs => {
      if (rs.status) {
        var obj = {
          label: rs.data.name,
          data: rs.data.id,
          idParent: rs.data.idParent,
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          children: []
        }
        this.lessonIds = [];
        // this.modelEdit = rs.data;
        rs.data.courseLessions.forEach(x => {
          this.lessonIds.push(x.idLession);
        });
        this.courseId = rs.data.id;
        if (this.modelEdit.id > 0) {
          this.selectedTreeNode.label = this.modelEdit.name;
        } else {
          // if (rs.data.idParent == 0) {
          //   this.dataTree.push(obj);
          // } else {
          //   this.dataTree.forEach(element => {
          //     this.AddNode(element, obj);
          //   });
          // }
          this.dataTree.push(obj);
        }
        this._notifierService.showSuccess('Cập nhật thành công');
        this.lessonIds = [];
        this.modelEdit = { isActive: true };
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

  AddNode(topNode: any, selectedNode: any) {
    if (topNode.data == selectedNode.idParent) {
      topNode.children.push(selectedNode);
      return;
    }
    if (topNode.children != null) {
      var i: number;
      for (i = 0; i < topNode.children.length; i++) {
        if (topNode.data == selectedNode.idParent) {
          topNode.children.push(selectedNode);
          return;
        }
        else this.AddNode(topNode.children[i], selectedNode);
      }
    }
    else return;
  }

  onDelete(item: any) {
    this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
      this._coursesService.delete(item.data).then(re => {
        if (re.status) {
          this._notifierService.showDeleteDataSuccess();

          this.dataTree = this.dataTree.filter(s => s.data !== item.data);

          this.dataTree.forEach(element => {
            this.deleteNode(element, item);
          });
        }
      });
    }).catch(err => {
      this._notifierService.showDeleteDataError();
    });
  }

  deleteNode(topNode: any, selectedNode: any) {
    if (topNode.children != null) {
      var i: number;
      for (i = 0; i < topNode.children.length; i++) {
        if (topNode.children[i].data == selectedNode.data) {
          topNode.children.splice(i, 1);
          return;
        }
        else this.deleteNode(topNode.children[i], selectedNode);
      }
    }
    else return;
  }

  toggleSearch() {
    super.toggleSearch();
    this.fixTableScrollProblem();
  }
  onChangeRowLimit() {
    this.fixTableScrollProblem();
  }
  // fix vụ lệch header ở table khi xuất hiện thanh scroll
  fixTableScrollProblem() {
    this.dataSource = [...this.dataSource];
  }
  onCloseForm() {
    // this.getData();
  }

  showPopup(id: any) {
    this._coursesLessonComponent.showPopup(id);
  }
  // ShowHideHtmlDetailFooter() {
  //   this.hideHtmlFooterSeo = !this.hideHtmlFooterSeo;
  // }
  // ShowHideHtmlDetailHeader() {
  //   this.hideHtmlHeaderSeo = !this.hideHtmlHeaderSeo;
  // }
}
