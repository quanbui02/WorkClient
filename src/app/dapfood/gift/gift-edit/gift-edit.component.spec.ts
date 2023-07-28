/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GiftEditComponent } from './gift-edit.component';

describe('GiftEditComponent', () => {
  let component: GiftEditComponent;
  let fixture: ComponentFixture<GiftEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
