import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { UserAddressUserService } from '../../services/useraddressUser.service';
import { DiaChiEditComponent } from './dia-chi-edit/dia-chi-edit.component';
@Component({
    selector: 'app-dia-chi',
    templateUrl: './dia-chi.component.html',
    styleUrls: ['./dia-chi.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DiaChiComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        key: '',
        idType: '',
    };
    categories_options: any[];
    @ViewChild(DiaChiEditComponent) _DiaChiEditComponent: DiaChiEditComponent;

    constructor(
        protected _injector: Injector,
        protected _userAddressService: UserAddressUserService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.categories_options = [{ label: '-- Loại --', value: -1 },
        { label: 'Nhà riêng', value: 1 },
        { label: 'Văn phòng', value: 2 }];
        await this.getData();
    }


    loadTableColumnConfig() {
        this.cols = [
            {
                field: 'name',
                header: 'Họ và tên',
                visible: true,
                sort: false,
            },
            {
                field: 'phone',
                header: 'Số điện thoại',
                visible: true,
                sort: false
            },
            {
                field: 'isDefault',
                header: 'Mặc định',
                visible: true,
                sort: false
            },
            {
                field: 'fullAddress',
                header: 'Địa chỉ',
                visible: true,
            },
        ];
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];

        await this.loadTableColumnConfig();
        await this._userAddressService.Gets(this.searchModel.key).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    onSearch() {
        this.getData();
    }

    updateDefault(item: any) {
        this._userAddressService.UpdateDefault(item.id).then(rs => {
            if (rs.status) {
                this.getData();
                this._notifierService.showSuccess(rs.message);
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
    }

    onDelete(item) {
        this._notifierService.showConfirm('Xóa bản ghi ?', 'Bạn có chắc muốn xóa bản ghi này ?').then(rs => {
            this._userAddressService.delete(item.id).then(re => {
                if (re.status) {
                    this.dataSource = this.dataSource.filter(obj => obj.id !== item.id);
                    this._notifierService.showSuccess("Xóa thành công");
                }
                else
                    this._notifierService.showError("Xóa thất bại");
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
    }

    onEdit(item) {
        this._DiaChiEditComponent.showPopup(item.id);
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

}
