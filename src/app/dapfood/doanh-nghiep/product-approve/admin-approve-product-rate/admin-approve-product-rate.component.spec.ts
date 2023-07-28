/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminPheDuyetProductRateComponent } from './admin-phe-duyet-product-rate.component';

describe('AdminPheDuyetProductRateComponent', () => {
  let component: AdminPheDuyetProductRateComponent;
  let fixture: ComponentFixture<AdminPheDuyetProductRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPheDuyetProductRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPheDuyetProductRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
