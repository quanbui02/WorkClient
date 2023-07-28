/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmTaskCommentLikesService } from './WmTaskCommentLikes.service';

describe('Service: WmTaskCommentLikes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmTaskCommentLikesService]
    });
  });

  it('should ...', inject([WmTaskCommentLikesService], (service: WmTaskCommentLikesService) => {
    expect(service).toBeTruthy();
  }));
});
