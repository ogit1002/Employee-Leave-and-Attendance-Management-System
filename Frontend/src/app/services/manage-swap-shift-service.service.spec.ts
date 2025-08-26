import { TestBed } from '@angular/core/testing';

import { ManageSwapShiftServiceService } from './manage-swap-shift-service.service';

describe('ManageSwapShiftServiceService', () => {
  let service: ManageSwapShiftServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSwapShiftServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
