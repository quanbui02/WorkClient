/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReportClientBaoCaoChiTietDonHangComponent } from './ReportClientBaoCaoChiTietDonHang.component';

describe('ReportClientBaoCaoChiTietDonHangComponent', () => {
  let component: ReportClientBaoCaoChiTietDonHangComponent;
  let fixture: ComponentFixture<ReportClientBaoCaoChiTietDonHangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportClientBaoCaoChiTietDonHangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportClientBaoCaoChiTietDonHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
