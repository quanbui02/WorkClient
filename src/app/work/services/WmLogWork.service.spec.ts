/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmLogWorkService } from './WmLogWorks.service';

describe('Service: WmLogWork', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmLogWorkService]
    });
  });

  it('should ...', inject([WmLogWorkService], (service: WmLogWorkService) => {
    expect(service).toBeTruthy();
  }));
});
