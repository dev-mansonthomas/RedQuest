import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Badge } from '../../../model/badges/Badge';
import { QueteurStats } from '../../../model/queteur-stats';
import { CloudFunctionService } from '../../../services/cloud-functions/cloud-function.service';

export interface BadgesLoadResult {
  badges: Badge[];
  hasStats: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BadgesService {

  constructor(private cloudFunctions: CloudFunctionService) {
  }

  loadQueteurBadgesLevels(badges: Badge[], queteur_id: number): Observable<BadgesLoadResult> {
    return this.cloudFunctions.getQueteurStats$()
        .pipe(map(rows => {
          const currentYearStats = rows.find(stat => stat.year === new Date().getFullYear());

          if (!currentYearStats) {
            console.warn(`Queteur stats unavailable for queteur id: ${queteur_id}`);
            return { badges, hasStats: false };
          }

          return { badges: this.updateBadgesLevels(badges, currentYearStats), hasStats: true };
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
