import { TestBed } from '@angular/core/testing';

import { QueteurService } from './queteur.service';

describe('QueteurService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: QueteurService = TestBed.inject(QueteurService);
        expect(service).toBeTruthy();
    });
});
