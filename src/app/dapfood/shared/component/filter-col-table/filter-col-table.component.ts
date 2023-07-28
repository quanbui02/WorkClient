import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { FilterUtils } from 'primeng/components/utils/filterutils';
import { OverlayPanel } from 'primeng/overlaypanel';
import { SecondPageIndexBase } from '../../../../lib-shared/classes/base/second-page-index-base';

@Component({
    selector: 'shared-filterColTable',
    templateUrl: './filter-col-table.component.html',
    styleUrls: ['./filter-col-table.component.scss']
})
export class Shared_filterColTableComponent extends SecondPageIndexBase implements OnInit {
    operator_options: any[];

    FilterUtilsFunction = {
        startsWith: FilterUtils.startsWith,
        contains: FilterUtils.contains,
        endsWith: FilterUtils.endsWith,
        equals: FilterUtils.equals,
        notEquals: FilterUtils.notEquals,
        in: FilterUtils.in,
        lt: FilterUtils.lt,
        lte: FilterUtils.lte,
        gt: FilterUtils.gt,
        gte: FilterUtils.gte

    };

    @ViewChild('op') op: OverlayPanel;

    @Input() filterAdv: boolean;
    @Input('mainTable') mainTable: Table;
    @Input() filterData;
    @Input() field;

    filterMatchMode1 = '';
    valueCompare1 = '';
    filterMatchMode2 = '';
    valueCompare2 = '';
    operator = 'and';
    filter: any = '';
    dataFilterSave = null;

    constructor(
        protected _injector: Injector
    ) {
        super(null, _injector);
    }

    ngOnInit() {
        this.loadStaticOptions();
        this.setFilterTable();
    }

    setFilterTable() {
        function getValueCompare(value) {
            if (!isNaN(value)) {
                return +value;
            }

            return value;
        }

        FilterUtils['custom'] = (value, filter): boolean => {
            const valueCompare1 = getValueCompare(filter.valueCompare1);
            const valueCompare2 = getValueCompare(filter.valueCompare2);
            const filterMatchMode1 = filter.filterMatchMode1;
            const filterMatchMode2 = filter.filterMatchMode2;
            const operator = filter.operator;
            const dataFilter = filter.dataFilter;

            if (!filterMatchMode1 && !filterMatchMode2) {
                return FilterUtils.in(value, dataFilter);
            }

            if (filterMatchMode1 && !filterMatchMode2) {
                return FilterUtils.in(value, dataFilter) && this.FilterUtilsFunction[filterMatchMode1](value, valueCompare1);
            }

            if (filterMatchMode1 && filterMatchMode2) {
                const check1 = this.FilterUtilsFunction[filterMatchMode1](value, valueCompare1);
                const check2 = this.FilterUtilsFunction[filterMatchMode2](value, valueCompare2);
                let check = check1 && check2;
                if (operator === 'or') {
                    check = check1 || check2;
                }
                return FilterUtils.in(value, dataFilter) && check;
            }

            return false;
        };
    }

    loadStaticOptions() {
        this.operator_options = [
            {
                label: '--',
                value: '',
                showInputCompare: false
            },
            {
                label: 'Bằng',
                value: 'equals',
                showInputCompare: true
            },
            {
                label: 'Không bằng',
                value: 'notEquals',
                showInputCompare: true
            },
            {
                label: 'Nhỏ hơn',
                value: 'lt',
                showInputCompare: true
            },
            {
                label: 'Nhỏ hơn hoặc bằng',
                value: 'lte',
                showInputCompare: true
            },
            {
                label: 'Lớn hơn',
                value: 'gt',
                showInputCompare: true
            },
            {
                label: 'Lớn hơn hoặc bằng',
                value: 'gte',
                showInputCompare: true
            }
        ];
    }

    reset() {
        this.filterMatchMode1 = '';
        this.valueCompare1 = '';
        this.filterMatchMode2 = '';
        this.valueCompare2 = '';
        this.operator = 'and';
        this.filter = '';
    }

    getDataFilter() {
        return FilterUtils.filter(this.filterData, ['text'], this.filter, 'contains');
    }

    onSearchFilter() {
        let dataFilter = [];

        this.filterData.forEach(item => {
            if (item.checked) {
                dataFilter.push(item.text);
            }
        });

        if (dataFilter.length === 0) {
            dataFilter = [''];
        }

        this.dataFilterSave = {
            valueCompare1: this.valueCompare1,
            valueCompare2: this.valueCompare2,
            filterMatchMode1: this.filterMatchMode1,
            filterMatchMode2: this.filterMatchMode2,
            operator: this.operator,
            dataFilter: dataFilter
        };

        this.mainTable.filter(this.dataFilterSave, this.field, 'custom');

        this.op.hide();
    }

    selectAllDataFilter(checked) {
        this.filterData.forEach(item => {
            item.checked = checked;
        });
    }

    getShowInputValueCompare1() {
        const operator = this.operator_options.find(i => i.value === this.filterMatchMode1);

        if (operator) {
            return !operator.showInputCompare;
        }

        return true;
    }

    getShowInputValueCompare2() {
        const operator = this.operator_options.find(i => i.value === this.filterMatchMode2);

        if (operator) {
            return !operator.showInputCompare;
        }

        return true;
    }

    cancel() {
        this.op.hide();
    }

    onShow() {
        if (this.dataFilterSave) {
            this.valueCompare1 = this.dataFilterSave.valueCompare1;
            this.valueCompare2 = this.dataFilterSave.valueCompare2;
            this.filterMatchMode1 = this.dataFilterSave.filterMatchMode1;
            this.filterMatchMode2 = this.dataFilterSave.filterMatchMode2;
            this.operator = this.dataFilterSave.operator;
        }
    }
}
