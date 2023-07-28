/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmTasksService } from './WmTasks.service';

describe('Service: WmTasks', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmTasksService]
    });
  });

  it('should ...', inject([WmTasksService], (service: WmTasksService) => {
    expect(service).toBeTruthy();
  }));
});
