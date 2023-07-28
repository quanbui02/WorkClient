/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmSprintsService } from './WmSprints.service';

describe('Service: WmSprints', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmSprintsService]
    });
  });

  it('should ...', inject([WmSprintsService], (service: WmSprintsService) => {
    expect(service).toBeTruthy();
  }));
});
