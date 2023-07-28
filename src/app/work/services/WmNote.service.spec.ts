/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmNoteService } from './WmNote.service';

describe('Service: WmNote', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmNoteService]
    });
  });

  it('should ...', inject([WmNoteService], (service: WmNoteService) => {
    expect(service).toBeTruthy();
  }));
});
