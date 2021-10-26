import { TestBed } from '@angular/core/testing';

import { ManageFolderService } from './manage-folder.service';

describe('ManageFolderService', () => {
  let service: ManageFolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageFolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
