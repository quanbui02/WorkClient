/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeliveriesService } from './deliveries.service';

describe('Service: Deliveries', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveriesService]
    });
  });

  it('should ...', inject([DeliveriesService], (service: DeliveriesService) => {
    expect(service).toBeTruthy();
  }));
});
