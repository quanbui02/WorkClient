/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OmicallLogComponent } from './omicallLog.component';

describe('OmicallLogComponent', () => {
  let component: OmicallLogComponent;
  let fixture: ComponentFixture<OmicallLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmicallLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmicallLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
