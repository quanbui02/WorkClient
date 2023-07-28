/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CourseLessonsService } from './courseLessons.service';

describe('Service: CourseLessons', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseLessonsService]
    });
  });

  it('should ...', inject([CourseLessonsService], (service: CourseLessonsService) => {
    expect(service).toBeTruthy();
  }));
});
