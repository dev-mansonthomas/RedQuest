import { TestBed } from '@angular/core/testing';

import { QueteurUlInfoService } from './queteur-ul-info.service';

describe('QueteurUlInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueteurUlInfoService = TestBed.get(QueteurUlInfoService);
    expect(service).toBeTruthy();
  });
});
