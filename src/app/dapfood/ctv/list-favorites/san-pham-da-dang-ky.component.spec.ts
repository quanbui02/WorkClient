/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SanPhamDaDangKyComponent } from './list-favorites.component';

describe('SanPhamDaDangKyComponent', () => {
  let component: SanPhamDaDangKyComponent;
  let fixture: ComponentFixture<SanPhamDaDangKyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SanPhamDaDangKyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanPhamDaDangKyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
