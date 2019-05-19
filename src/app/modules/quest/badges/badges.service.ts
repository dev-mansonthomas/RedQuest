import {Injectable} from '@angular/core';
import {FirestoreService} from '../../../services/firestore/firestore.service';
import {QueteurStats} from '../../../model/queteur-stats';
import {map} from 'rxjs/operators';
import {Badges} from '../../../model/badges';
import {Observable} from 'rxjs';
import {TimePipe} from '../../../pipes/time.pipe';
import {WeightPipe} from '../../../pipes/weight.pipe';

@Injectable({
  providedIn: 'root'
})
export class BadgesService {

  constructor(private firestore: FirestoreService) {
  }

  loadQueteurBadgesLevels(queteur_id: number): Observable<Badges> {
    return this.firestore.getQueteurStats(queteur_id).pipe(map(doc => {
      const currentYearStats = doc.docs
        .map(e => e.data() as QueteurStats)
        .filter(stat => stat.year === new Date().getFullYear())[0];
      return this.badgesLevels(currentYearStats);
    }));
  }


  private badgesLevels(currentYearStats: QueteurStats) {
    console.log('stats:', currentYearStats);
    return new Badges(
      {
        level: currentYearStats.amount_year_objective ? this.percentageLevel(currentYearStats) : undefined,
        value: currentYearStats.amount_year_objective
          ? ((currentYearStats.amount / currentYearStats.amount_year_objective) * 100) + '%'
          : undefined,
        more: currentYearStats.amount_year_objective ? currentYearStats.amount_year_objective : undefined
      },
      {level: this.numberOfDaysLevel(currentYearStats), value: currentYearStats.number_of_days_quete + ' jours'},
      {level: this.numberOfLocationsLevel(currentYearStats), value: currentYearStats.number_of_point_quete + ' lieux'},
      {level: this.numberOfTroncsLevel(currentYearStats), value: currentYearStats.number_of_tronc_queteur + ' troncs'},
      {level: this.amountCbLevel(currentYearStats), value: currentYearStats.amount_cb + '€'},
      {
        level: this.timeSpentLevel(currentYearStats),
        value: new TimePipe().transform(currentYearStats.time_spent_in_minutes)
      },
      {level: this.weightLevel(currentYearStats), value: new WeightPipe().transform(currentYearStats.weight)}
    );
  }

  private timeSpentLevel(currentYearStats: QueteurStats): number {
    const timeSpent = currentYearStats.time_spent_in_minutes;
    if (timeSpent < 60) {
      return 0;
    } else if (timeSpent < 180) {
      return 1;
    } else if (timeSpent < 360) {
      return 2;
    } else if (timeSpent < 720) {
      return 3;
    } else {
      return 4;
    }
  }

  private amountCbLevel(currentYearStats: QueteurStats) {
    const amountCb = currentYearStats.amount_cb;
    if (amountCb < 5) {
      return 0;
    } else if (amountCb < 100) {
      return 1;
    } else if (amountCb < 300) {
      return 2;
    } else if (amountCb < 500) {
      return 3;
    }
    return 4;
  }

  private numberOfTroncsLevel(currentYearStats: QueteurStats) {
    const numberOfTroncs = currentYearStats.number_of_tronc_queteur;
    if (numberOfTroncs < 2) {
      return 0;
    } else if (numberOfTroncs < 5) {
      return 1;
    } else if (numberOfTroncs < 10) {
      return 2;
    } else if (numberOfTroncs < 20) {
      return 3;
    }
    return 4;
  }

  private numberOfLocationsLevel(currentYearStats: QueteurStats) {
    const totalNumberOfPointQuete = currentYearStats.total_number_of_point_quete;
    if (totalNumberOfPointQuete < 10) {
      return this.numberOfLocationsLevelLessThan10(currentYearStats.number_of_point_quete, totalNumberOfPointQuete);
    }
    return this.numberOfLocationsLevelMoreThan10(currentYearStats.number_of_point_quete);
  }

  private numberOfDaysLevel(currentYearStats: QueteurStats) {
    const numberOfDays = currentYearStats.number_of_days_quete;
    if (numberOfDays < 1) {
      return 0;
    } else if (numberOfDays < 4) {
      return 1;
    } else if (numberOfDays < 7) {
      return 2;
    } else if (numberOfDays < 9) {
      return 3;
    }
    return 4;
  }

  private percentageLevel(currentYearStats: QueteurStats): number {
    if (currentYearStats.amount_year_objective) {
      const percentage = (currentYearStats.amount / currentYearStats.amount_year_objective) * 100;
      if (percentage === 0) {
        return 0;
      } else if (percentage < 2) {
        return 1;
      } else if (percentage < 4) {
        return 2;
      } else if (percentage < 8) {
        return 3;
      }
      return 4;
    }
    return undefined;
  }

  private weightLevel(currentYearStats: QueteurStats): number {
    const weight = currentYearStats.weight;
    if (weight < 600) {
      return 0;
    } else if (weight < 5000) {
      return 1;
    } else if (weight < 15000) {
      return 2;
    } else if (weight < 30000) {
      return 3;
    }
    return 4;
  }

  private numberOfLocationsLevelMoreThan10(numberOfLocations: number) {
    if (numberOfLocations === 0) {
      return 0;
    } else if (numberOfLocations < 3) {
      return 1;
    } else if (numberOfLocations < 6) {
      return 2;
    } else if (numberOfLocations < 10) {
      return 3;
    }
    return 4;
  }

  private numberOfLocationsLevelLessThan10(numberOfLocations: number, totalLocations: number) {
    const percentage = numberOfLocations / totalLocations * 100;
    if (percentage === 0) {
      return 0;
    } else if (percentage < 30) {
      return 1;
    } else if (percentage < 60) {
      return 2;
    } else if (percentage < 80) {
      return 3;
    }
    return 4;
  }
}
