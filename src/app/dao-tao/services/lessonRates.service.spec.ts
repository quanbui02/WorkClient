/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LessonRatesService } from './lessonRates.service';

describe('Service: LessonRates', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LessonRatesService]
    });
  });

  it('should ...', inject([LessonRatesService], (service: LessonRatesService) => {
    expect(service).toBeTruthy();
  }));
});
