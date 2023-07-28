import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'file-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
    dataSource = [{ name: 'Trang chủ', id: 0 }];
    items = [
        // { label: 'Categories' },
        // { label: 'Sports' },
        // { label: 'Football' },
        // { label: 'Countries' },
        // { label: 'Spain' },
        // { label: 'F.C. Barcelona' },
        // { label: 'Squad' },
        // { label: 'Lionel Messi', url: 'https://en.wikipedia.org/wiki/Lionel_Messi' }
    ];
    home = { icon: 'pi pi-home' };


    @Input() folderChanged = new EventEmitter<string>();
    @Output() selectFolder: EventEmitter<any> = new EventEmitter<any>();

    constructor() {

    }

    ngOnInit() {
        this.folderChanged.subscribe(rs => {
            if (rs) {
                if (rs.displayPath && rs.idPath) {
                    const dsArr = [{ name: 'Trang chủ', id: 0 }];
                    const arrDisplayPath = rs.displayPath.split('>');
                    const arrIdPath = rs.idPath.split(';');

                    for (let i = 1; i < arrDisplayPath.length; i++) {
                        dsArr.push({ name: arrDisplayPath[i], id: arrIdPath[i + 1] });
                        this.items.push({ label: arrDisplayPath[i] });
                    }

                    this.dataSource = dsArr;
                } else {
                    // root folder
                    this.dataSource = [{ name: 'Trang chủ', id: 0 }];
                }

            } else {
                // root folder
                this.dataSource = [{ name: 'Trang chủ', id: 0 }];
            }
        });
    }

    selectItem(item: any) {
        this.selectFolder.next(item);
    }

    onItemClick(item: any) {
        let sss = item;
        // this.selectFolder.next(item);
    }
}
