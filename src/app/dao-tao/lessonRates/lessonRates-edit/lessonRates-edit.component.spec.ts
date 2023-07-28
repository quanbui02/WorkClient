/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LessonRatesEditComponent } from './lessonRates-edit.component';

describe('LessonRatesEditComponent', () => {
  let component: LessonRatesEditComponent;
  let fixture: ComponentFixture<LessonRatesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonRatesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonRatesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
