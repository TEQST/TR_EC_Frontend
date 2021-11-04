import { TestBed } from '@angular/core/testing';

import { TranscribeTabNavService } from './transcribe-tab-nav.service';

describe('TranscribeTabNavService', () => {
  let service: TranscribeTabNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranscribeTabNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
