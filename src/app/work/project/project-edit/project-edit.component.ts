import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { WmProjectsService } from '../../services/WmProjects.service';
import { async } from '@angular/core/testing';
import { UserService } from '../../../lib-shared/services/user.service';

@Component({
   selector: 'app-project-edit',
   templateUrl: './project-edit.component.html',
   styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent extends SecondPageEditBase
   implements OnInit {
   isLoading = false;
   modelEdit: any = {};
   project_options: any[] = [];
   users_options: any[] = [];
   projectMember: any = [];
   results: any[] = [];

   constructor(
      protected _injector: Injector,
      private formBuilder: FormBuilder,
      private _WmProjectsService: WmProjectsService,
      private _userService: UserService
   ) {
      super(null, _injector);
   }

   async ngOnInit() {
      this.formGroup = this.formBuilder.group({
         description: [''],
         name: ['', Validators.required],
         idParent: [''],
         image: [''],
         isWorkFolow: [''],
         sort: [''],
         // member: ['']
      });

      await this.getProjectOption();
      // await this.getUserOptions();
   }

   async autoComplete(event) {
      this.users_options = [];
      await this._userService.AutoComplete(
         event.query,
         0,
         1000
      ).then(rs => {
         if (rs.status) {
            this.results = rs.data;
         }
      });
   }

   async getProjectOption() {
      this.project_options = [{ label: 'Chọn project', value: 0 }];
      await this._WmProjectsService.Gets('', true, true, false, 0, 100, '', true).then(rs => {
         if (rs.status) {
            rs.data.forEach(value => {
               this.project_options.push({ label: value.name, value: value.id });
            });
         }
      });
   }

   save() {
      // this.modelEdit.wmProjectMembers = [];
      // this.projectMember.forEach(x => {
      //    this.modelEdit.wmProjectMembers.push({
      //       Id: 0,
      //       UserId: x.userId
      //    });
      // });
      this._WmProjectsService.Save(this.modelEdit).then(rs => {
         if (rs.status) {
            this._notifierService.showSuccess('Cập nhật thành công');
            this.isShow = false;
            this.closePopup.emit();
            this.modelEdit = {};
            if (!rs.data.idParent) {
               this.project_options.push({ label: rs.data.name, value: rs.data.id });
            }
         } else {
            this._notifierService.showError(rs.message);
         }
      });
   }

   async showPopup(id: any) {
      this.isShow = true;
      this.projectMember = [];
      if (id > 0) {
         await this._WmProjectsService.GetDetail(id)
            .then(async response => {
               if (response.status) {
                  this.modelEdit = response.data;
                  this.projectMember = response.data.user;
               }
            }, () => {
               this._notifierService.showHttpUnknowError();
            });
      } else {
         this.modelEdit = {};
      }
   }
}