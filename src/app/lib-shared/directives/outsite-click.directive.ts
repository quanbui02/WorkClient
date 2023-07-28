import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[vsOverlay]'
})
export class OutsideClickDirective {
  @Output() appOutsideClick = new EventEmitter();


  constructor(private _elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {

    let btn = this._elementRef.nativeElement.firstChild;
    let popup = this._elementRef.nativeElement.lastChild;

    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (clickedInside) {
      if (!popup.contains(targetElement) && popup.className == "vs-overlay-popup active") {
        popup.classList.remove("active");
        btn.classList.remove("active");
        this.appOutsideClick.emit(true);
      }
      else {
        popup.classList.add("active");
        btn.classList.add("active");
        this.appOutsideClick.emit(false);
      }
    } else {
      try {
        if (!targetElement.className.includes("ui-dropdown-item") && !targetElement.offsetParent.className.includes("ui-dropdown-panel")) {
          popup.classList.remove("active");
          btn.classList.remove("active");
          this.appOutsideClick.emit(true);
        }
      } catch (ex) { }
    }
  }
  // @HostListener('click')
  // clickInside($event) {
  //   console.log("sss");
  //   //this.text = "clicked inside";
  //   //$event.stopPropagation();
  // }

}