import { stringify } from 'querystring';
import { PathologiesCategoryService } from './../services/PathologiesCategory.service';
import { NewsCategoriesService } from './../services/news-categories.service';
import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TreeNode } from '@angular/router/src/utils/tree';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-PathologyCategories',
  templateUrl: './PathologyCategories.component.html',
  styleUrls: ['./PathologyCategories.component.scss']
})
export class PathologyCategoriesComponent extends SecondPageIndexBase implements OnInit {
  searchModel: any = {
    key: ''
  };
  dataTree: any = [];
  menuItems: any = [
    { label: 'Thêm con', icon: 'pi pi-fw pi-plus', command: (event) => this.onEdit(0, this.selectedTreeNode.data) },
    { label: 'Thêm cùng cấp', icon: 'pi pi-fw pi-plus', command: (event) => this.onEdit(0, this.selectedTreeNode.idParent) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: (event) => this.onEdit(this.selectedTreeNode.data, -1) },
    { label: 'Xóa', icon: 'pi pi-fw pi-trash', command: (event) => this.onDelete(this.selectedTreeNode) },
  ];
  selectedTreeNode: any;
  modelEdit: any = {
    isActive: true,
    idParent: 0
  };
  dropdownCategories: any[];
  formGroup: FormGroup = new FormGroup({});
  // hideHtmlFooterSeo = true;
  // hideHtmlHeaderSeo = true;
  // @ViewChild(CategoryEditComponent) _CategoryEditComponent: CategoryEditComponent;

  constructor(
    protected _injector: Injector,
    private formBuilder: FormBuilder,
    private _pathologyCategoriesServices: PathologiesCategoryService
  ) {
    super(null, _injector);
    this.formGroup = this.formBuilder.group({
      name: [''],
      idParent: [''],
      image: [''],
      // avatar: [''],
      isActive: [''],
      // isPrivate: [''],
      key: [''],
      sort: [''],
      // descriptionSeo: [''],
      // titleSeo: [''],
      // detailFooterSeo: [''],
      // detailHeaderSeo: [''],
      // detailHtmlFooterSeo: [''],
      // detailHtmlHeaderSeo: [''],
    });
  }

  async ngOnInit() {
    //this.loadTableColumnConfig();
    await this.onLoadCategories();
    await this.getData();
  }

  // loadTableColumnConfig() {
  //   this.cols = [
  //     {
  //       field: 'image',
  //       header: 'Hình ảnh',
  //       visible: true,
  //       align: 'center',
  //       width: '10%',
  //       sort: true,
  //     },
  //     {
  //       field: 'avatar',
  //       header: 'Hình ảnh menu',
  //       visible: true,
  //       align: 'center',
  //       width: '10%',
  //       sort: true,
  //     },
  //     {
  //       field: 'name',
  //       header: 'Tên',
  //       visible: true,
  //       width: '20%',
  //       sort: true
  //     },
  //     {
  //       field: 'description',
  //       header: 'Mô tả',
  //       visible: true,
  //       sort: true
  //     },
  //     {
  //       field: 'sort',
  //       header: 'Thứ tự',
  //       visible: true,
  //       width: '10%',
  //       align: 'center',
  //       sort: true
  //     },
  //     {
  //       field: 'isActive',
  //       header: 'Trạng thái',
  //       visible: true,
  //       align: 'center',
  //       width: '10%',
  //       sort: true
  //     }
  //   ];
  // }

  async onLoadCategories() {
    this.dropdownCategories = [{ label: '-- Danh mục gốc --', value: 0 }];
    await this._pathologyCategoriesServices.searchDropdown('').then(rs => {
      rs.data.forEach(value => {
        this.dropdownCategories.push(value);
      });
    });

  }

  async getData() {
    this.isLoading = true;
    this.dataSource = [];
    await this._pathologyCategoriesServices.Gets(
      this.searchModel.key,
      (this.page - 1) * this.limit,
      this.limit,
      this.sortField
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;

        this.dataSource.filter(s => s.idParent == 0).forEach(s => {
          let obj = {
            label: s.name,
            data: s.id,
            idParent: s.idParent,
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
            children: []
          };
          this.dataSource.filter(x => x.idParent == s.id).forEach(s1 => {
            let obj1 = {
              label: s1.name,
              data: s1.id,
              idParent: s1.idParent,
              expandedIcon: "pi pi-folder-open",
              collapsedIcon: "pi pi-folder",
              children: []
            };
            this.dataSource.filter(x => x.idParent == s1.id).forEach(s2 => {
              let obj2 = {
                label: s2.name,
                data: s2.id,
                idParent: s2.idParent,
                expandedIcon: "pi pi-image",
                collapsedIcon: "pi pi-folder",
              };
              obj1.children.push(obj2);
            })
            obj.children.push(obj1);
          })
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

  onEdit(id: any, idParent: number) {
    this.modelEdit = {
      idParent: idParent,
      isActive: true
    };
  }
  onTreeClick(item) {
    //this._CategoryEditComponent.showPopup(item.data);
  }

  async nodeSelect(event) {
    if (this.selectedTreeNode.data > 0) {
      await this._pathologyCategoriesServices.getDetail(this.selectedTreeNode.data)
        .then(async response => {
          if (response.status) {
            this.modelEdit = response.data;
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
    this._pathologyCategoriesServices.post(this.modelEdit).then(rs => {
      if (rs.status) {
        var obj = {
          label: rs.data.name,
          data: rs.data.id,
          idParent: rs.data.idParent,
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          children: []
        }
        if (this.modelEdit.id > 0) {
          this.selectedTreeNode.label = this.modelEdit.name;
        } else {
          if (rs.data.idParent == 0) {
            this.dataTree.push(obj);
          } else {
            this.dataTree.forEach(element => {
              this.AddNode(element, obj);
            });
          }
        }
        this._notifierService.showSuccess('Cập nhật thành công');
        this.modelEdit = { isActive: true, idParent: 0 };
        this.dropdownCategories.push({ label: "+ " + obj.label, value: obj.data });
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
      this._pathologyCategoriesServices.delete(item.data).then(re => {
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
    this.getData();
  }
  // ShowHideHtmlDetailFooter() {
  //   this.hideHtmlFooterSeo = !this.hideHtmlFooterSeo;
  // }
  // ShowHideHtmlDetailHeader() {
  //   this.hideHtmlHeaderSeo = !this.hideHtmlHeaderSeo;
  // }
}
