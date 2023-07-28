/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViTienComponent } from './vi-tien.component';

describe('ViTienComponent', () => {
  let component: ViTienComponent;
  let fixture: ComponentFixture<ViTienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViTienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViTienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
