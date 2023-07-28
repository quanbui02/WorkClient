/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FaqEditComponent } from './faq-edit.component';

describe('FaqEditComponent', () => {
  let component: FaqEditComponent;
  let fixture: ComponentFixture<FaqEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
