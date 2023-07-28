/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaoCaoNhomTheoCtvComponent } from './bao-cao-nhom-theo-ctv.component';

describe('BaoCaoNhomTheoCtvComponent', () => {
  let component: BaoCaoNhomTheoCtvComponent;
  let fixture: ComponentFixture<BaoCaoNhomTheoCtvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaoCaoNhomTheoCtvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoNhomTheoCtvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
