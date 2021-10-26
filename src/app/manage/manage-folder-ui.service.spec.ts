import { TestBed } from '@angular/core/testing';

import { ManageFolderUiService } from './manage-folder-ui.service';

describe('ManageFolderUiService', () => {
  let service: ManageFolderUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageFolderUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
