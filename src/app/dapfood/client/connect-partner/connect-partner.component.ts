import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ClientsService } from '../../services/clients.service';
import { AhamoveService } from '../../services/ahamove.service';
import { SecondPageEditBase } from '../../../lib-shared/classes/base/second-page-edit-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { User } from '../../../lib-shared/models/user';

@Component({
    selector: 'app-connect-partner',
    templateUrl: './connect-partner.component.html',
    styleUrls: ['./connect-partner.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConnectPartnerComponent extends SecondPageEditBase implements OnInit {
    modelEdit: any = {};
    isLoading = false;
    users: any;
    dataSource = [];
    key: string;
    total = 0;
    page = 1;
    limit = 100;
    user = new User();
    listLogistics: any[] = [];   // Danh sách đơn vị giao hàng
    listTranport: any[] = [];
    dataGetLogistics: any[];   // Danh sách đơn vị giao hàng
    vnpostIsPackageViewable: any[]; // = [{ label: '-- Tỉnh/TP --', value: 0 }];
    ahamove_PickWorkShift: any[] = [];
    ahamove_PickOption: any[] = [];
    vnpostPickupType: any[]; // = [{ label: '-- Quận huyện--', value: 0 }];
    viettel_Post_TenAddress_options: any;
    ghtkPickWorkShift: any;
    ghtkPickOption: any;
    ghN_TenKho_options: any;
    ghnRequiredNote: any;
    giaoHangTranspor: any;
    jntServiceType: any[];
    showDescription: any;
    supershipConfig: any[];
    logisticsService: string = '';

    constructor(
        protected _injector: Injector,
        private formBuilder: FormBuilder,
        private _ClientService: ClientsService,
        private userService: UserService,
        private _AhamoveService: AhamoveService,
    ) {
        super(null, _injector);
        this.formGroup = this.formBuilder.group({
            listLogistics: [''],
            idPhuongThucGiaoHang: ['', Validators.compose([Validators.required])],
            ahamove_PickWorkShift: [''],
            ahamove_PickOption: [''],
            giaoHangTranspor: ['', Validators.compose([Validators.required])],
            ahamove_UserName: ['', Validators.compose([Validators.required])],
        });
    }


    async ngOnInit() {
        await this.GetLogistics();
    }

    async GetLogistics() {
        this.listLogistics = [{ label: 'Ahamove', value: 1 }];
        this.dataGetLogistics = [{ id: 1, name: "Ahamove" }];
        this.ahamove_PickWorkShift = [{ value: 1, label: 'Giao tận tay' }, { value: 2, label: 'Giao dưới công ty/ chung cư' }];
        this.ahamove_PickOption = [{ value: 0, label: 'Giao luôn' }, { value: 1, label: 'Sau 1h' }, { value: 2, label: 'Sau 2h' }, { value: 3, label: 'Sau 3h' }, { value: 24, label: 'Hôm sau' }];
        await this.LoadInfo();

    }

    async LoadInforClient() {
        await this._ClientService.GetByToken().then(rs => {
            if (rs.status) {
                if (rs.data.isConnectLogistics === true) {
                    this.modelEdit.ahamove_UserName = rs.data.logisticsUsername;
                    this.modelEdit.ahamove_PickWorkShift = rs.data.logisticsPickWorkShift;
                    this.modelEdit.ahamove_PickOption = rs.data.logisticsPickOption;
                    this.modelEdit.giaoHangTranspor = rs.data.logisticsServices;
                    this.logisticsService = rs.data.logisticsServices;
                    this.modelEdit.idPhuongThucGiaoHang = rs.data.logisticsId;
                } else {
                    this.modelEdit.ahamove_UserName = rs.data.phone;
                }

            } else {
                this._notifierService.showError(rs.message);
            }
        });
    }

    async LoadInfo() {
        await this.LoadInforClient();
        //if ahamove
        await this.loadListService();
        if (this.logisticsService && this.logisticsService.length > 0) {
            document.getElementById('showDescription').innerHTML = this.listTranport.find(d => d.value === this.logisticsService).label;
        }
        this.modelEdit.giaoHangTranspor = this.logisticsService;
        this.isLoading = false;
    }

    async loadListService() {
        if (this.modelEdit.idPhuongThucGiaoHang === 1) {
            await this._AhamoveService.GetListServices('HAN').then(rs => {
                if (rs.status) {
                    rs.data.forEach(item => {
                        this.listTranport.push({ label: item.name, value: item._id, desc: item.fee_description_en_us });
                    });
                }
            });
        }
    }

    onShowDescription(event) {
        var value = event.value;
        var desc = this.listTranport.filter(d => d.value === value)[0].desc;
        document.getElementById('showDescription').innerHTML = desc;
    }

    onChangeDonViGiaoHang() {
        this.LoadInfo();
    }

    async ViettelPostGetAddress() {
        this.viettel_Post_TenAddress_options = [];   // { label: '-- Trạng thái --', value: -1 }
        await this._ClientService.ViettelPostGetAddress().then(rs => {
            if (rs.status) {
                rs.data.data.forEach(item => {
                    this.viettel_Post_TenAddress_options.push({ label: item.name, value: item.groupaddressId });
                });
            }
        });
    }

    async GHN_GetDanhSachCH() {
        this.ghN_TenKho_options = [];   // { label: '-- Trạng thái --', value: -1 }
        await this._ClientService.GHN_GetDanhSachCH(this.modelEdit).then(rs => {
            if (rs.status) {
                rs.data.data.forEach(item => {
                    this.ghN_TenKho_options.push({ label: item.name, value: item._id });
                });
            }
        });
    }

    viettel_Post_MaAddress_SetValue() {
        let obj = this.viettel_Post_TenAddress_options.find(s => s.value == this.modelEdit.viettel_Post_MaAddress);
        this.modelEdit.viettel_Post_TenAddress = obj.label;
    }

    ghN_TenKho_SetValue() {
        let obj = this.ghN_TenKho_options.find(s => s.value == this.modelEdit.ghN_MaKho);
        this.modelEdit.ghN_TenKho = obj.label;
    }

    async ConnectDonViLogictics() {
        this.isLoading = true;
        await this._ClientService.ConnectDonViLogictics(this.modelEdit).then(async rs => {
            if (rs.status) {
                // await this.GetInfo();
                this._notifierService.showSuccess(rs.message);
            } else {
                this._notifierService.showError(rs.message);
            }
            this.isLoading = false;
        }).catch(err => {
            this.isLoading = false;
            this._notifierService.showHttpUnknowError();
        });
    }

    save() {
        this.isLoading = true;
        this._ClientService.UpdateDonViLogictics(this.modelEdit).then(rs => {
            if (rs.status) {
                this._notifierService.showSuccess(rs.message);
            } else {
                this._notifierService.showError(rs.message);
            }
            this.isLoading = false;
        });
        //this.isLoading = false;
    }

    onSelect(event) {
        this.user = event;
    }
    async autoComplete(event) {
        const query = event.query;
        await this.userService.SearchNotInClient(query, 0, 10).then(rs => {
            if (rs.status) {
                this.users = rs.data;
                this.users.forEach(item => {
                    item.fullDisplayName = item.name + '(' + item.userName + ')';
                });
                this.total = rs.totalRecord;
            }
        });
    }

    togglePopupDelete(): any {
        this.modelEdit = {};
    }
}
