/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CskhComponent } from './cskh.component';

describe('CskhComponent', () => {
  let component: CskhComponent;
  let fixture: ComponentFixture<CskhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CskhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CskhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
