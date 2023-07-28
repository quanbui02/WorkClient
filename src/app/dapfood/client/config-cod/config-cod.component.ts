import { Component, Injector, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { ClientsService } from '../../services/clients.service';
import { ShipConfigsService } from '../../services/ShipConfigs.service';
@Component({
    selector: 'app-config-cod',
    templateUrl: './config-cod.component.html',
    styleUrls: ['./config-cod.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfigCodComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        isActive: -1,
        type: -1
    };
    active_options: any[];
    modelEdit: any = {};

    //@ViewChild(SupplierEditComponent) _SupplierEditComponent: SupplierEditComponent;

    constructor(
        protected _injector: Injector,
        private _ShipConfigsService: ShipConfigsService,
        private _ClientService: ClientsService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.cols = [
            {
                field: 'fromValue',
                header: 'Giá trị đơn hàng từ (trở lên)',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'ship',
                header: 'Phí vận chuyển',
                visible: true,
                align: 'right',
                sort: true
            },
            {
                field: 'actions',
                header: 'Thao tác',
                visible: true,
                align: 'center',
                width: '150px',
                sort: true
            }
        ];
        await this.loadActiveOptions();
        await this.getData();
    }

    async loadActiveOptions() {
        this.active_options = [{ label: '-- Trạng thái --', value: -1 }];
        this.active_options.push({ label: 'Không sử dụng', value: 0 });
        this.active_options.push({ label: 'Sử dụng', value: 1 });
    }

    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        await this._ShipConfigsService.Gets(
            this.searchModel.key,
            (this.page - 1) * this.limit,
            this.limit,
            this.sortField,
            this.isAsc
        ).then(rs => {
            if (rs.status) {
                this.dataSource = rs.data;
                this.dataSource.push({ id: 0, doanhSo: null, giaCODHoTro: null });
                this.total = rs.totalRecord;
            }
        }).catch(error => {
            this.isLoading = false;
            this._notifierService.showResponseError(error);
        }); 0
        this.resetBulkSelect();
        this.isLoading = false;
    }

    onSearch() {
        this.getData();
    }

    onEdit(item: any) {
        item.isEdit = item.isEdit == true ? false : true;
    }

    onSave(item: any) {
        if (item.fromValue === null || item.ship === null || item.fromValue === "" || item.ship === "") {
            this._notifierService.showError("Vui lòng nhập đủ thông tin !");
            return;
        }
        this.isLoading = true;
        this._ShipConfigsService.post(item).then(rs => {
            if (rs.status) {
                item.isEdit = item.isEdit == true ? false : true;
                this._notifierService.showSuccess(rs.message);
                this.getData();
            }
            else
                this._notifierService.showError(rs.message);
            this.isLoading = false;
        });
    }

    onDelete(id: number) {
        this._notifierService.showConfirm('Xóa bản ghi?', 'Bạn có chắc muốn xóa bản ghi này?').then(rs => {
            this._ShipConfigsService.delete(id).then(re => {
                if (re.status) {
                    this._notifierService.showDeleteDataSuccess();
                    this.dataSource = this.dataSource.filter(obj => obj.id !== id);
                }
            });
        }).catch(err => {
            this._notifierService.showDeleteDataError();
        });
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