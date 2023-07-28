/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeleteSprintColsComponent } from './delete-project-cols.component';

describe('DeleteSprintColsComponent', () => {
  let component: DeleteSprintColsComponent;
  let fixture: ComponentFixture<DeleteSprintColsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteSprintColsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSprintColsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
