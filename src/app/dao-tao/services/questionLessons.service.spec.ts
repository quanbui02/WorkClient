/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuestionLessonsService } from './questionLessons.service';

describe('Service: QuestionLessons', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionLessonsService]
    });
  });

  it('should ...', inject([QuestionLessonsService], (service: QuestionLessonsService) => {
    expect(service).toBeTruthy();
  }));
});
