/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LichSuGiaoDichComponent } from './lich-su-giao-dich.component';

describe('LichSuGiaoDichComponent', () => {
  let component: LichSuGiaoDichComponent;
  let fixture: ComponentFixture<LichSuGiaoDichComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LichSuGiaoDichComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LichSuGiaoDichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
