import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { BlockableUI } from 'primeng/api';

@Component({
    selector: 'blockable-div',
    template: `<div [ngStyle]="style" [ngClass]="class" ><ng-content></ng-content><div style='clear: both;'></div></div>`
})
export class BlockableDivComponent implements OnInit, BlockableUI {

    @Input() style: any;
    @Input() class: any;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }
}
