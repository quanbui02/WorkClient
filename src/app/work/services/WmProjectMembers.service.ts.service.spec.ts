/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmProjectMembers.service.tsService } from './WmProjectMembers.service';

describe('Service: WmProjectMembers.service.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmProjectMembers.service.tsService]
    });
  });

  it('should ...', inject([WmProjectMembers.service.tsService], (service: WmProjectMembers.service.tsService) => {
    expect(service).toBeTruthy();
  }));
});
