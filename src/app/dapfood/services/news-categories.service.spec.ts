/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsCategoriesService } from './news-categories.service';

describe('Service: NewsCategories', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsCategoriesService]
    });
  });

  it('should ...', inject([NewsCategoriesService], (service: NewsCategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
