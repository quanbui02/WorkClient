/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LogWorkComponent } from './log-work.component';

describe('LogWorkComponent', () => {
  let component: LogWorkComponent;
  let fixture: ComponentFixture<LogWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
