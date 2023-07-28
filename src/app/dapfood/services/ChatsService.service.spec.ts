/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatsServiceService } from './ChatsService.service';

describe('Service: ChatsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatsServiceService]
    });
  });

  it('should ...', inject([ChatsServiceService], (service: ChatsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
