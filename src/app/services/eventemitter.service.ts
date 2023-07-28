import { EventEmitter } from '@angular/core';

export class EventEmitterService {
    event: EventEmitter<any> = new EventEmitter();
    notification: EventEmitter<any> = new EventEmitter();
    omicall: EventEmitter<any> = new EventEmitter();
    chat: EventEmitter<any> = new EventEmitter();
    updateCountIconMessageChat: EventEmitter<any> = new EventEmitter();
    project: EventEmitter<any> = new EventEmitter();
    work: EventEmitter<any> = new EventEmitter();
    projectWork: EventEmitter<any> = new EventEmitter();
    // constructor() { }
    // emitEvent(number) {
    //     this.event.emit(number);
    // }
    // subscribeEvent() {
    //     return this.event;
    // }
}