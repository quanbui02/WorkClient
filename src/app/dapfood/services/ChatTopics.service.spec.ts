/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatTopicsService } from './ChatTopics.service';

describe('Service: ChatTopics', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatTopicsService]
    });
  });

  it('should ...', inject([ChatTopicsService], (service: ChatTopicsService) => {
    expect(service).toBeTruthy();
  }));
});
