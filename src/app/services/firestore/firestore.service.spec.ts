import { TestBed } from '@angular/core/testing';

import { FirestoreService } from './firestore.service';

describe('FirestoreService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: FirestoreService = TestBed.inject(FirestoreService);
        expect(service).toBeTruthy();
    });
});
