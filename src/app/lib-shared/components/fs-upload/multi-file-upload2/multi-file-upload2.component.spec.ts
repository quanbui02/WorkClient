/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MultiFileUpload2Component } from './multi-file-upload2.component';

describe('MultiFileUpload2Component', () => {
  let component: MultiFileUpload2Component;
  let fixture: ComponentFixture<MultiFileUpload2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiFileUpload2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFileUpload2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
