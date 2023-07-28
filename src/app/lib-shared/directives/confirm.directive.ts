import { Directive, Input, Output, HostListener, EventEmitter } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Directive({
  selector: '[confirm]'
})
export class ConfirmDirective {
  @Input('confirm') text: string;
  @Output('confirm-click') click: any = new EventEmitter();

  @HostListener('click', ['$event']) clicked(e) {
    var _this = this;

    $.confirm({
      animation: "scale",
      closeAnimation: "scale",
      animateFromElement: false,
      title: "Xác nhận",
      content: this.text,
      buttons: {
        confirm: {
          text: "Xác nhận",
          btnClass: "btn-blue",
          keys: ["enter"],
          action: function() {
            _this.click.emit();
          }
        },
        cancel: {
          text: "Hủy bỏ",
          btnClass: "btn-default",
          keys: ["esc"]
        }
      }
    });
  }

  constructor() { }
}
