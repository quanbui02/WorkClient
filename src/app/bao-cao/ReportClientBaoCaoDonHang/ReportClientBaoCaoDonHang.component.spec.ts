/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReportClientBaoCaoDonHangComponent } from './ReportClientBaoCaoDonHang.component';

describe('ReportClientBaoCaoDonHangComponent', () => {
  let component: ReportClientBaoCaoDonHangComponent;
  let fixture: ComponentFixture<ReportClientBaoCaoDonHangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportClientBaoCaoDonHangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportClientBaoCaoDonHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
