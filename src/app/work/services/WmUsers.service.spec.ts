/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmUsersService } from './WmUsers.service';

describe('Service: WmUsers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmUsersService]
    });
  });

  it('should ...', inject([WmUsersService], (service: WmUsersService) => {
    expect(service).toBeTruthy();
  }));
});
