/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmTaskCommentsService } from './WmTaskComments.service';

describe('Service: WmTaskComments', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmTaskCommentsService]
    });
  });

  it('should ...', inject([WmTaskCommentsService], (service: WmTaskCommentsService) => {
    expect(service).toBeTruthy();
  }));
});
