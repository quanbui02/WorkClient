/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StatusEditComponent } from './project-cols-edit.component';

describe('StatusEditComponent', () => {
  let component: StatusEditComponent;
  let fixture: ComponentFixture<StatusEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
