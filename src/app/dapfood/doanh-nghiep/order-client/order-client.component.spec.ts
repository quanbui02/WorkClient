/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OrderClientComponent } from './order-client.component';

describe('OrderClientComponent', () => {
  let component: OrderClientComponent;
  let fixture: ComponentFixture<OrderClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderClientComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
