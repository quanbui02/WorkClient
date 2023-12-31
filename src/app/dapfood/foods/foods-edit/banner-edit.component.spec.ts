/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BannerEditComponent } from './foods-edit.component';

describe('BannerEditComponent', () => {
  let component: BannerEditComponent;
  let fixture: ComponentFixture<BannerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BannerEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
