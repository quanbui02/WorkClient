import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeDragDropService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { SecondPageIndexBase } from '../../lib-shared/classes/base/second-page-index-base';
import { WmProjectsService } from '../services/WmProjects.service';
import { ProjectEditComponent } from '../project/project-edit/project-edit.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-group-task',
  templateUrl: './group-task.component.html',
  providers: [TreeDragDropService, MessageService],
  styleUrls: ['./group-task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupTaskComponent extends SecondPageIndexBase implements OnInit {
  @ViewChild(ProjectEditComponent) _ProjectEditComponent: ProjectEditComponent;
  searchModel: any = {
    key: '',
    isActive: -1,
    type: -1
  };
  menuOrigin: any[];
  selectedMenu: TreeNode;
  datasource: TreeNode[];
  typeMenu: number = 1;
  idProject?: number;
  checkMenu: boolean = true;
  tabNumber: number = 1;
  selectedTreeNode: any;
  dataOutput: any;


  menuItems: any = [
    { label: 'Thêm dự án', icon: 'pi pi-fw pi-plus', command: (event) => this.onCreateProject() },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: (event) => this.onShowFormUpdate(this.selectedTreeNode) },
    // { label: 'Xóa', icon: 'pi pi-fw pi-trash', command: (event) => this.loadMenuEditProjects },
  ];
  constructor(
    protected _injector: Injector,
    private _WmProjectsService: WmProjectsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { super(null, _injector); }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.idProject = parseInt(params['id']);
      this.dataOutput = {
        idProject: 999,
        idSprint: 99
      };

    });

    // this.activatedRoute.queryParams.subscribe(params => {
    //   debugger;
    //   console.log(params); // Prints {id: "2"}
    // });

    // this.activatedRoute.data.subscribe((data) => {
    //   debugger;
    //   const aaa = data;
    //   // const crisis: Crisis = data['crisis'];
    //   // this.editName = crisis.name;
    //   // this.crisis = crisis;
    // });
    // const id = this.activatedRoute.snapshot.paramMap.get('idProject');

    this.loadMenuProject();
  }

  // danh sách sản phầm
  async loadMenuProject() {
    this.datasource = [];
    await this._WmProjectsService.GetProjectsMenu("").then(rs => {
      if (rs.status) {
        this.datasource = rs.data;
        this.menuOrigin = rs.data;
      }
    });
  }

  nodeSelect(event) {
    //debugger;
    this.dataOutput = event.data;
    this.selectedTreeNode = event;
    this.typeMenu = event.data.type;
    this.idProject = event.data.idProject == 0 ? null : event.data.idProject;
    this.checkMenu = !this.checkMenu;
    this.tabNumber = 1;

    this.onCloseFormUpdate();
    // this._notifierService.showSuccess('Lựa chọn menu = ' + event.node.label);
    // console.log(event.node)
  }

  nodeUnselect(event) {
    this._notifierService.showSuccess('Bỏ lựa chọn menu = ' + event.node.label);
  }

  changeTask(event, tabNumber) {
    this.tabNumber = tabNumber;
    event.currentTarget.classList.add("active_task_screen");
  }
  loadMenuEditProjects() {
    this.loadMenuProject();
  }

  onCloseForm() {
    this.loadMenuProject();
  }
  onCreateProject() {
    this._ProjectEditComponent.showPopup(0);
  }

  onShowFormUpdate(data) {
    this.onCloseFormUpdate()

    let key = data.key;
    let editForm = document.getElementById("edit_name_node_" + key);
    let showFrom = document.getElementById("show_name_node_" + key);

    editForm.classList.remove("d-none");
    showFrom.classList.add("d-none");

    editForm.focus();
  }

  onCloseFormUpdate() {
    let editForm = document.getElementsByClassName("node_tree_name_edit");
    let showFrom = document.getElementsByClassName("node_tree_name");

    for (let i = 0; i < editForm.length; i++) {
      editForm[i].classList.add("d-none");
      showFrom[i].classList.remove("d-none")
    }
  }

  onSaveProject() {
    let data = {
      id: this.selectedTreeNode.data.idProject,
      name: this.selectedTreeNode.label
    }
    this._WmProjectsService.Save(data).then(rs => {
      if (rs.status) {
        this._notifierService.showSuccess('Cập nhật thành công');
        this.onCloseFormUpdate();
      } else {
        this._notifierService.showError(rs.message);
      }
    });
  }

  onSearchMenu() {
    this.datasource = this.menuOrigin.filter(x => x.label.toLowerCase().includes(this.searchModel.key.toLowerCase()));
  }
}
