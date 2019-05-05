import { TestBed } from '@angular/core/testing';

import { CloudFunctionService } from './cloud-function.service';

describe('CloudFunctionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudFunctionService = TestBed.get(CloudFunctionService);
    expect(service).toBeTruthy();
  });
});
