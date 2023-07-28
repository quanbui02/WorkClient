import { Directive, ElementRef } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'img[tnShowDefaultImageOnError]'
})
export class ShowDefaultImageOnErrorDirective {

    constructor(private el: ElementRef) {
        // this.el.nativeElement.error = () => {
        //     console.log('error');
        // };
        // el.nativeElement.on('error', function () {
        //     console.error('error directive');
        // });
    }

}
