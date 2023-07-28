/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmProjectsService } from './WmProjects.service';

describe('Service: WmProjects', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmProjectsService]
    });
  });

  it('should ...', inject([WmProjectsService], (service: WmProjectsService) => {
    expect(service).toBeTruthy();
  }));
});
