import { CskhCtvDetailComponent } from './cskh-ctv-detail/cskh-ctv-detail.component';
import { OmiCallLogsService } from './../../services/OmiCallLogs.service';
import { User } from './../../../lib-shared/models/user';
import { ConfigurationService } from '../../../lib-shared/services/configuration.service';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SecondPageIndexBase } from '../../../lib-shared/classes/base/second-page-index-base';
import { UserService } from '../../../lib-shared/services/user.service';
import { OmiCallsService } from '../../../lib-shared/services/omicall.service';
import { EventEmitterService } from '../../../services/eventemitter.service';
import { DialogService, DynamicDialogRef } from 'primeng/primeng';
import { CustomerInfoComponent } from '../../cskh/customer-info/customer-info.component';
import { ProvincesService } from '../../services/provinces.service';

declare var omiSDK: any;
@Component({
    selector: 'app-cskh-ctv',
    templateUrl: './cskh-ctv.component.html',
    styleUrls: ['./cskh-ctv.component.scss']
})
export class CSKHCTVComponent extends SecondPageIndexBase implements OnInit {
    searchModel: any = {
        key: '',
        trangThai: -1,
        isKol: -1,
        idRef: -1,
        fromDate: new Date(),
        toDate: new Date(),
    };
    trangThai_options: any[];
    support_options: any[];
    typeRole_options: any[];
    lstKol_options: any[];
    crrUser: User;
    omicall_contacts: any = {
        tags: ["Khách hàng DapFood"],
        more_infomation: [],
        user_owner_email: "",
        refId: "",
        refCode: "",
        job_title: "",
        note: "",
        birthday: "",
        gender: "",
        fullName: "",
        passport: "",
        address: "",
        emails: [],
        phones: []
    };

    emails: any = {
        data: "",
        value: "",
        valueType: ""
    };

    phones: any = {
        data: "",
        value: "",
        valueType: ""
    };
    omicallLogs: any = [];
    hideme = [];
    Index: any;
    vi: any;
    UserIdSelected: number;
    ref: DynamicDialogRef;
    list_units = [];
    constructor(
        protected _injector: Injector,
        private _UserService: UserService,
        private _omiCallsService: OmiCallsService,
        private _EventEmitterService: EventEmitterService,
        public _OmicallLogsService: OmiCallLogsService,
        public dialogService: DialogService,
        private _ProvincesService: ProvincesService,
        private _configurationService: ConfigurationService,
    ) {
        super(null, _injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;
        var dateObj = new Date();
        var month = dateObj.getMonth();
        var d = new Date(dateObj.getFullYear(), month + 1, 0);
        this.searchModel.fromDate = new Date(dateObj.getFullYear(), month, 1);
        this.searchModel.toDate = d;

        this._EventEmitterService.omicall.subscribe(item => this.ShowLogsOmicall(item));
        this.crrUser = await this._UserService.getCurrentUser();
        this.openSearchAdv = true;
        this.trangThai_options = [{ label: '-- Tất cả --', value: -1 },
        { label: 'Chưa hỗ trợ', value: 0 },
        { label: 'Tôi hỗ trợ', value: 1 }];

        this.typeRole_options = [{ label: '-- Tất cả --', value: -1 },
        { label: 'Khách hàng', value: 0 },
        { label: 'Cộng tác viên', value: 1 }];
        this.loadKols();
        await this.loadUnits();
        this.initDefaultOption();
        await this.loadDynamicOptionsAndGetData();
    }

    async loadKols() {
        this.lstKol_options = [{ label: '-- Không chọn CTV --', value: -1 }];
        await this._UserService.GetsListKOL("").then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.lstKol_options.push({ label: item.userName + "(" + item.name + ")", value: item.userId });
                });
            }
        });
    }
    async loadUnits() {
        await this._ProvincesService.GetShortProduct(-1, -1).then(rs => {
            if (rs.status) {
                rs.data.forEach(item => {
                    this.list_units.push({ label: item.label, value: item.value });
                });
            }
        });
    }
    ShowLogsOmicall(item: any) {
        if (item.length && this.UserIdSelected) {
            var modelOmicallUpdate = {
                Id: item.id,
                UserId: this.UserIdSelected
            }
            this._OmicallLogsService.UpdateOmicallLog(modelOmicallUpdate)
                .then(res => {
                    // console.log("du lieu tra ve omicall log - " + JSON.stringify(res));
                });
        }
    }

    loadTableColumnConfig() {
        this.cols = [
            { field: 'lastCall', header: 'Liên hệ', visible: true, width: '40px', sort: true, align: 'center' },
            { field: 'code', header: 'Mã', visible: true, width: '40px', sort: true, align: 'center' },
            { field: 'name', header: 'Tên khách hàng', visible: true, width: '80px', sort: true },
            { field: 'address', header: 'Địa chỉ', visible: true, width: '120px', sort: false },
            { field: 'phone', header: 'Điện thoại', visible: true, width: '40px', sort: false, align: 'center' },
            { field: 'gender', header: 'Giới tính', visible: true, width: '40px', sort: true, align: 'center' },
            { field: 'birthday', header: 'Sinh nhật', visible: true, width: '40px', sort: true, align: 'center' },
            { field: 'email', header: 'Email', visible: true, width: '40px', sort: false },
            { field: 'nameRef', header: 'Giới thiệu', visible: true, width: '40px', sort: false },
            { field: 'isOmiCall', header: 'Đồng bộ OmiCall', visible: false, width: '80px', sort: false },
            { field: 'countOrdersFinish', header: 'Đơn thành công', visible: true, width: '35px', sort: true, align: 'center' },
            { field: 'totalOrdersFinish', header: 'Tiền thành công', visible: true, width: '40px', sort: true, align: 'right' },
            { field: 'totalSales', header: 'Tích lũy', visible: true, width: '40px', sort: true, align: 'right' },
            { field: 'balance', header: 'Ví tiền', visible: true, width: '40px', sort: true, align: 'right' },
            { field: 'totalReward', header: 'Tổng Hoa hồng', visible: true, width: '40px', sort: true, align: 'right' }
        ];
    }
    initDefaultOption() {
        this.searchModel.key = '';
        this.searchModel.trangThai = 1;
        this.searchModel.idProvince = -1;
    }
    async loadDynamicOptionsAndGetData() {
        this.getData();
        this.loadTableColumnConfig();
    }
    getData() {
        this.isLoading = true;
        this.dataSource = [];
        this._UserService.GetsForSupportCSKH(this.searchModel.key, this.searchModel.fromDate, this.searchModel.toDate, -1, this.searchModel.idProvince, this.searchModel.trangThai, this.searchModel.isKol, this.searchModel.idRef, (this.page - 1) * this.limit, this.limit, this.sortField, this.isAsc).then(rs => {
            if (rs.data) {
                this.dataSource = rs.data;
                this.total = rs.totalRecord;
                this.isLoading = false;
            }
        }).catch(error => {
            this.isLoading = false;
            this._notifierService.showHttpUnknowError();
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
    onChangeRowLimit() {
        this.getData();
        this.fixTableScrollProblem();
    }
    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    fixTableScrollProblem() {
        this.dataSource = [...this.dataSource];
    }
    onCloseForm() {
        this.getData();
    }
    RemoveSupportCTV(item: any) {
        this._UserService.RemoveSupportCTV(item.userId).then(rs => {
            if (rs.status) {
                this.getData();
                this._notifierService.showSuccess('Hủy đăng ký thành công!');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
    }
    PickSupportCTV(item: any) {
        this._UserService.PickSupportCTV(item.userId).then(rs => {
            if (rs.status) {
                this.getData();
                this._notifierService.showSuccess('Đăng ký thành công!');
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
    }

    onEdit(id: number) {
    }

    callOmiCall(item) {
        this.UserIdSelected = item.userId;
        omiSDK.makeCall(item.phone, { datas: { 'User-Data': "UserId_" + item.userId } });
    }

    async PickKol(item: any) {
        await this._notifierService.showConfirm("Bạn muốn cập nhật CTV", 'Xác nhận').then(rs => {
            if (!item.isKol || item.isKol === false) {
                this._UserService.PickKol(item.userId).then(rs => {
                    if (rs.status) {
                        item.isKol = true;
                        this._notifierService.showSuccess('Cập nhật CTV thành công!');
                    } else {
                        this._notifierService.showError(rs.message);
                    }
                });
            } else {
                this._UserService.RemovePickKol(item.userId).then(rs => {
                    if (rs.status) {
                        item.isKol = false;
                        this._notifierService.showSuccess('Hủy CTV thành công!');
                    } else {
                        this._notifierService.showError(rs.message);
                    }
                });
            }
            this.resetBulkSelect();
        }).catch(err => {
            this._notifierService.showDeleteDataError();
            return false;
        });


    }

    RemoveUserOmicall(item: any) {
        if (!item.phone || item.phone === '') {
            this._notifierService.showWarning('Người dùng không tồn tại số điện thoại!');
            return;
        }

        this._omiCallsService.ContactsPhone(item.phone).then(contactsresponse => {
            if (contactsresponse.status && contactsresponse.data.status_code == 9999) {
                if (contactsresponse.data.payload && contactsresponse.data.payload._id) {
                    // console.log("Id khách hang: " + contactsresponse.data.payload._id);
                    this._omiCallsService.ContactsDelete(contactsresponse.data.payload._id)
                        .then(Deleteresponse => {
                            if (Deleteresponse.status && Deleteresponse.data.status_code == 9999) {
                                item.IsOmiCall = false;
                                this._UserService.UpdateOmicall(item).then(rs => {
                                    if (rs.status) {
                                        this.getData();
                                        this._notifierService.showSuccess('Hủy đồng bộ thành công!');
                                    } else
                                        this._notifierService.showError(rs.message);
                                });
                            }
                            else
                                this._notifierService.showError(Deleteresponse.message);
                        }
                        );
                }
                else
                    this._notifierService.showError("Khách hàng chưa được động bộ Omicall");
            }
            else
                this._notifierService.showError(contactsresponse.message);
        });
        this.resetBulkSelect();
    }

    onOmicall(item: any) {
        if (!item.phone || item.phone === '') {
            this._notifierService.showWarning('Người dùng không tồn tại số điện thoại!');
            return;
        }
        this.omicall_contacts.refId = item.phone;
        this.omicall_contacts.refCode = item.phone;
        this.omicall_contacts.fullName = item.name;
        this.emails.data = item.email;
        this.phones.data = item.phone;
        this.omicall_contacts.emails = [this.emails];
        this.omicall_contacts.phones = [this.phones];

        this._omiCallsService.ContactsAdd(this.omicall_contacts).then(omicallresponse => {
            if (omicallresponse.status && omicallresponse.data.status_code == 9999) {
                item.IsOmiCall = true;
                this._UserService.UpdateOmicall(item).then(rs => {
                    if (rs.status) {
                        this.getData();
                        this._notifierService.showSuccess('Đồng bộ người dùng thành công!');
                    } else {
                        this._notifierService.showError(rs.message);
                    }
                });

            }
            else {
                this._notifierService.showError(omicallresponse.message);
            }
        });

        this.resetBulkSelect();
    }

    async showOmicallsLogOrderAction(index: any, id: any) {
        if (!this.omicallLogs[index] || this.omicallLogs[index] == JSON.stringify([])) {
            await this._OmicallLogsService.GetLogByOrderAction(id).then(res => {
                if (res.status) {
                    this.omicallLogs[index] = res.data;
                }
                else this._notifierService.showError(res.message);
            });
        }
        if (JSON.stringify(this.omicallLogs[index]) != JSON.stringify([])) {
            this.hideme[index] = !this.hideme[index];
            this.Index = index;
        }

    }

    onShowDetailUserCurr(item) {
        this.ref = this.dialogService.open(CustomerInfoComponent, {
            data: {
                userId: item
            },
            header: 'Thông tin khách hàng',
            width: '95%',
            height: 'calc(100vh - 100px)',
            styleClass: "vs-modal",
            contentStyle: { 'overflow': 'auto', 'position': 'relative' }, //'max-height': 'calc(100vh - 180px);', 
            baseZIndex: 1001,
            closeOnEscape: true
        });

        this.ref.onClose.subscribe((re: any) => {
            this.isLoading = false;
        });
    }

    onShowDetailCustomer(id) {
        let userCurr = this.dataSource.filter(x => x.userId == id)
        this.ref = this.dialogService.open(CskhCtvDetailComponent, {
            data: {
                userId: id
            },
            header: `Thông tin chi tiết CTV: ${userCurr[0].name}`,
            width: '95%',
            height: 'calc(100vh - 100px)',
            styleClass: "vs-modal",
            contentStyle: { 'overflow': 'auto' }, //'max-height': 'calc(100vh - 180px);', 
            baseZIndex: 1001,
            closeOnEscape: true
        });

        this.ref.onClose.subscribe((re: any) => {
            if (re != null) {
                this.isLoading = false;
            }
        });
    }

    getAvatar(id) {
        if (id) {
            return this.getImageAvatar(id);
        }
        else {
            return `/assets/images/avatar.jpg`;
        }
    }

    getlastCall(datelastCall: any): any {
        if (datelastCall) {
            let ms1 = new Date(datelastCall).getTime();
            let ms2 = new Date().getTime();
            return Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000));
            //return new Date(datelastCall).getDate();
        }
        else {
            return '';
        }
    }
}
