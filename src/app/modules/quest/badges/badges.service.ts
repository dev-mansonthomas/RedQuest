import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Badge } from '../../../model/badges/Badge';
import { QueteurStats } from '../../../model/queteur-stats';
import { FirestoreService } from '../../../services/firestore/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class BadgesService {

  constructor(private firestore: FirestoreService) {
  }

  loadQueteurBadgesLevels(badges: Badge[], queteur_id: number): Observable<Badge[]> {
    return this.firestore.getQueteurStats(queteur_id)
      .pipe(map(doc => {
        const currentYearStats = doc.docs
          .map(e => e.data() as QueteurStats)
          .filter(stat => stat.year === new Date().getFullYear())[0];
        return this.updateBadgesLevels(badges, currentYearStats);
      }));
  }

  private updateBadgesLevels(badges: Badge[], currentYearStats: QueteurStats): Badge[] {
    if (currentYearStats) {// stats are defined in firebase
      if (!(currentYearStats.amount_year_objective && currentYearStats.amount_year_objective > 0)) {
        badges = badges.filter(badge => badge.id !== 'objective_percentage');
      }
      badges.forEach(badge => badge.update(currentYearStats));
      return badges;
    }
  }


}
