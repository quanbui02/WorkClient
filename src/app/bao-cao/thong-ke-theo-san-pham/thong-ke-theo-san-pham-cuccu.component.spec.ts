/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThongKeTheoSanPhamCuccuComponent } from './thong-ke-theo-san-pham.component';

describe('ThongKeTheoSanPhamCuccuComponent', () => {
  let component: ThongKeTheoSanPhamCuccuComponent;
  let fixture: ComponentFixture<ThongKeTheoSanPhamCuccuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThongKeTheoSanPhamCuccuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongKeTheoSanPhamCuccuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
