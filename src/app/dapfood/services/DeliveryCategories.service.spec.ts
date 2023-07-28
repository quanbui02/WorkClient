/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeliveryCategoriesService } from '../deliverys/services/deliverycategories.service';

describe('Service: DeliveryCategories', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryCategoriesService]
    });
  });

  it('should ...', inject([DeliveryCategoriesService], (service: DeliveryCategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
