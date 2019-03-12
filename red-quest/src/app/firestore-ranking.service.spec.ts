import { TestBed } from '@angular/core/testing';

import { FirestoreRankingService } from './firestore-ranking.service';

describe('FirestoreRankingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestoreRankingService = TestBed.get(FirestoreRankingService);
    expect(service).toBeTruthy();
  });
});
