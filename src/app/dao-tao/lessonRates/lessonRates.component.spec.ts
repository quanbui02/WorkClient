/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LessonRatesComponent } from './lessonRates.component';

describe('LessonRatesComponent', () => {
  let component: LessonRatesComponent;
  let fixture: ComponentFixture<LessonRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
