import { TestBed } from '@angular/core/testing';

import { ManageTranscriptionUiService } from './manage-transcription-ui.service';

describe('ManageTranscriptionUiService', () => {
  let service: ManageTranscriptionUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageTranscriptionUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
