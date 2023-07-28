import {
    Component,
    OnInit,
    forwardRef,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { ModuleConfigService } from '../../../services/module-config.service';
import { VsModuleConfig } from '../../../models/module-config';
import { VsFsFileUploadService } from '../services/file-upload.service';
import { FsFolder } from '../models/fs-folder';
import { SelectItem } from 'primeng/api';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'vs-fs-folder-picker',
    templateUrl: './fs-folder-picker.component.html',
    styleUrls: ['./fs-folder-picker.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VsFsFolderPickerComponent),
            multi: true
        }
    ]
})
export class VsFsFolderPickerComponent
    implements OnInit, ControlValueAccessor {
    config: VsModuleConfig;
    data: SelectItem[];
    dataOb = new Subject<SelectItem[]>();
    selectedValue: SelectItem;
    @Input() disabled = false;
    @Input() defaultSelected = true;
    @Input() userSelected = 0;

    userId: number;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    constructor(
        private _moduleConfigService: ModuleConfigService,
        private _fsFolderService: VsFsFileUploadService,
        private _userService: UserService,
    ) {
        this.config = _moduleConfigService.getConfig();
    }

    ngOnInit() {
        this.dataOb.subscribe(items => {
            this.data = items;
            if (
                !this.selectedValue &&
                this.data.length > 0 &&
                this.defaultSelected
            ) {
                this.selectedValue = this.data[0];
                this.onChangeControl(this.selectedValue.value.id);
            }
        });
        this.loadDataSource();
    }

    loadDataSource() {
        this.userId = this._userService.getBasicUserInfo().userId;
        this._fsFolderService.getTreeView(this.userId).then(rs => {
            if (rs.status) {
                const arrTemp = [];
                const arrDataTemp = this.processTreeViewDataSource(rs.data);
                for (let i = 0; i < arrDataTemp.length; i++) {
                    const item: FsFolder = arrDataTemp[i];
                    arrTemp.push({ label: item.tenHienThi, value: item });
                }
                this.dataOb.next(arrTemp);
            } else {
                console.error('Cannot load Folder:' + rs.error);
            }
        });
    }
    processTreeViewDataSource(ds: FsFolder[]): FsFolder[] {
        const lstPbOutput = ds.filter(x => x.parentId === 0);
        let op: FsFolder[] = [];
        for (let i = 0; i < lstPbOutput.length; i++) {
            const parentId = lstPbOutput[i].id;
            lstPbOutput[i].tenHienThi = lstPbOutput[i].name;
            op.push(lstPbOutput[i]);
            const child = this.processTreeViewItem(ds, parentId, 0);
            op = op.concat(child);
        }

        return op;
    }

    processTreeViewItem(
        ds: FsFolder[],
        parentId: number,
        level: number
    ): FsFolder[] {
        let op: FsFolder[] = [];
        const lstPbOutput = ds.filter(x => x.parentId === parentId);
        let str = '';
        level += 1;
        for (let i = 0; i < level; i++) {
            str += '-- ';
        }
        for (let i = 0; i < lstPbOutput.length; i++) {
            lstPbOutput[i].tenHienThi = str + lstPbOutput[i].name;
            op.push(lstPbOutput[i]);

            const _parentId = lstPbOutput[i].id;
            const child = this.processTreeViewItem(ds, _parentId, level);
            op = op.concat(child);
        }
        return op;
    }

    onChangeControl = (obj: number) => { };
    onTouched = () => { };

    writeValue(obj: number): void {
        if (obj !== null) {
            if (!this.data) {
                this.dataOb.subscribe(items => {
                    const item = items.find(x => x.value.id === obj);

                    if (item) {
                        this.selectedValue = item.value;
                    }
                });
            } else {
                const item = this.data.find(x => x.value.id === obj);
                if (item) {
                    this.selectedValue = item.value;
                }
            }
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeControl = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onChangeSelectedValue(selected: FsFolder) {
        this.onChangeControl(selected.id);
        this.onChange.emit(selected);
    }
}
