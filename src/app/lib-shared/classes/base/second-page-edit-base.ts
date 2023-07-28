import { Output, EventEmitter, ViewChild, Injector, ElementRef, OnInit } from '@angular/core';
import { ComponentBase } from './component-base';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormSchemaItem } from '../form-schema';
import { ValidationSummaryComponent } from '../../components/validation-summary/validation-summary.component';
import { NotifierService } from '../../services/notifier.service';
import { BaseService } from '../../services/base.service';
import { Dialog } from 'primeng/dialog';
import { CommonService } from '../../services/common.service';
import { FileUpload } from 'primeng/primeng';
import { CONFIG_CALENDAR_VIETNAMESE } from '../../../config/calendar.config';
import { VsMySettingService } from '../../../services/ccmysetting.service';
import { VsMySetting } from '../../../models/ccmysetting';

export class SecondPageEditBase extends ComponentBase implements OnInit {

    @ViewChild('validationSummary') validationSummary: ValidationSummaryComponent;
    @ViewChild('dialog') dialog: Dialog;
    @ViewChild('formElement') formElement: ElementRef;
    @ViewChild('pUpload') pUpload: FileUpload;

    vi = CONFIG_CALENDAR_VIETNAMESE;
    isShow = false;
    submitting = false;
    openPopupDelete = false;

    itemDetail: any = {};
    formSchema: FormSchemaItem[] = [];
    uploadedFiles: any[] = [];

    popupHeader = '';
    popupId: string;
    formGroup: FormGroup = new FormGroup({});
    limitSize: number;

    limitAll = 10000;

    protected _mySettingService: VsMySettingService;

    arrTrangThai = [
        { label: 'Sử dụng', value: 1 },
        { label: 'Không Sử dụng', value: 2 }
    ];

    @Output() closePopup = new EventEmitter<any>();
    mySetting = new VsMySetting();

    constructor(
        protected _baseService: BaseService,
        protected _injector: Injector,

    ) {
        super();
        this._mySettingService = this._injector.get(VsMySettingService);
        this._notifierService = this._injector.get(NotifierService);
        this.popupId = this._injector.get(CommonService).guid();
        this.mySetting = this._mySettingService.getCurrentSetting();

        // this._masterDataService.getConfigByCode('SizeOfFile')
        //     .then(response => {
        //         if (response) {
        //             this.limitSize = Number(response) * 1000 * 1000;
        //         }
        //     });
    }

    ngOnInit(): void {
        // this._masterDataService.getConfigByCode('SizeOfFile')
        //     .then(response => {
        //         if (response) {
        //             this.limitSize = Number(response) * 1000 * 1000;
        //         }
        //     });
    }

    save() {
        this.submitting = true;

        if (this.formGroup.invalid) {
            this.validationSummary.showValidationSummary();
            this.showValidateMessage();
            this.submitting = false;
            this.scrollToTop();
            return;
        }

        this.onBeforeSave();

        if (this.itemDetail['id']) {
            this.onUpdate();
        } else {
            this.onInsert();
        }
    }

    showValidateMessage() {

    }

    onBeforeSave() {

    }

    onAfterSave() {

    }

    async showPopup(data: any = {}) {
        this.isShow = true;
        this.openPopupDelete = false;
        await this.onShowPopup(data);

        setTimeout(() => {
            const viewRef = document.getElementById(this.popupId);
            if (viewRef != null) {
                const input = viewRef.querySelector('input');
                if (input) {
                    input.focus();
                } else {
                    const texateara = viewRef.querySelector('textarea');

                    if (texateara) {
                        texateara.focus();
                    }
                }
            }

            if (this.dialog) {
                this.dialog.center();
            }
        }, 500);
    }

    onShowPopup(data: any) {
        this.onReset();

        this.onBeforeShowPopUp();

        if (data > 0) {
            this._baseService.getDetail(data)
                .then(async response => {

                    this.itemDetail = response.data;
                    this.onAfterShowPopUp();

                }, error => {
                    this._notifierService.showHttpUnknowError();
                });
        }
    }

    onReset() {
        this.itemDetail = {};
    }

    onAfterShowPopUp() {

    }

    onBeforeShowPopUp() {

    }

    closePopupMethod(data: any) {
        this.isShow = false;
        this.closePopup.next(data);
    }

    getMaxWidthDialog() {
        return (window.innerHeight - 200).toString() + 'px';
    }

    onInsert() {
        this._baseService.post(this.itemDetail)
            .then(response => {
                this.closePopupMethod(true);
                this._notifierService.showInsertDataSuccess();
                this.onAfterSave();
                this.submitting = false;
            }, error => {
                this._notifierService.showInsertDataFailed();
                this.submitting = false;
            });
    }

    onUpdate() {
        this._baseService.put(this.itemDetail['id'].toString(), this.itemDetail)
            .then(response => {
                this.closePopupMethod(true);
                this._notifierService.showUpdateDataSuccess();
                this.onAfterSave();
                this.submitting = false;
            }, error => {
                this._notifierService.showUpdateDataFailed();
                this.submitting = false;
            });
    }

    cancel() {
        this.closePopupMethod(null);
    }

    buildFormGroup(formGroup?: FormGroup, formSchema?: FormSchemaItem[]) {
        const formGroupD = formGroup || this.formGroup;
        const formSchemaD = formSchema || this.formSchema;
        for (let i = 0; i < formSchemaD.length; i++) {
            const schemaItem = formSchemaD[i];
            const formControl = new FormControl('');
            if (schemaItem.control && schemaItem.control.defaultValue !== undefined) {
                this.itemDetail[schemaItem.field] = schemaItem.control.defaultValue;
                if (!schemaItem.visible && schemaItem.control.defaultValue) {
                    formControl.setValue(schemaItem.control.defaultValue);
                }
            }

            if (schemaItem.validators && schemaItem.validators.required) {
                formControl.setValidators(Validators.required);
            }

            formGroupD.addControl(schemaItem.field, formControl);
        }
    }

    resetForm() {
        if (this.validationSummary) {
            this.validationSummary.resetErrorMessages();
        }

        if (this.pUpload) {
            this.pUpload.clear();
        }

        this.formGroup.reset();
        this.itemDetail = {};
        this.uploadedFiles = [];
        this.submitting = false;
    }

    delete(id: number) {
        this._notifierService.showDeleteConfirm().then(rs => {
            this._baseService.delete(id)
                .then(response => {
                    this.closePopupMethod({});
                    this._notifierService.showDeleteDataSuccess();
                }, error => {
                    this._notifierService.showDeleteDataError();
                });
        });
    }

    scrollToTop() {
        if (this.formElement) {
            setTimeout(() => {
                this.formElement.nativeElement.scrollIntoView();
            }, 500);
        }
    }

    isValid(submitting = true) {
        if (this.formGroup.invalid) {
            this.validationSummary.showValidationSummary();
            this.submitting = false;
            return;
        }
        this.validationSummary.resetErrorMessages();
        return this.formGroup.valid;
    }

    togglePopupDelete() {
        this.openPopupDelete = !this.openPopupDelete;
    }
    resetDialogPosition() {
        window.setTimeout(() => {
            this.dialog.center();
        });
    }
    getMaxDialogHeight() {
        return (window.innerHeight - 200).toString() + 'px';
    }
    handleTabChange(event) {
        this.resetDialogPosition();
    }

    convertDataToOptions(options: any[], data: any[], fieldName: string) {
        if (data.length > 0) {
            data.map(item =>
                options.push({ label: item[fieldName], value: item.id })
            );
        }
    }
}
