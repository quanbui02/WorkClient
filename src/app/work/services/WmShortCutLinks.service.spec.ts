/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmShortCutLinksService } from './WmShortCutLinks.service';

describe('Service: WmShortCutLinks', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmShortCutLinksService]
    });
  });

  it('should ...', inject([WmShortCutLinksService], (service: WmShortCutLinksService) => {
    expect(service).toBeTruthy();
  }));
});
