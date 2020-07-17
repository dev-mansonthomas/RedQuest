import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: AuthGuard = TestBed.inject(AuthGuard);
        expect(service).toBeTruthy();
    });
});
