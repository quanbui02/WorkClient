/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PathologiesComponent } from './Pathologies.component';

describe('PathologiesComponent', () => {
  let component: PathologiesComponent;
  let fixture: ComponentFixture<PathologiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathologiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathologiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
