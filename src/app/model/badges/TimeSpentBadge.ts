import {Badge} from './Badge';
import {QueteurStats} from '../queteur-stats';
import {BadgeLevelsDesc} from './BadgeLevelsDesc';
import {TimePipe} from '../../pipes/time.pipe';

export class TimeSpentBadge extends Badge {

  constructor() {
    super(
      'fas fa-hourglass',
      'Temps écoulé',
      'Quêter un maximum de temps.',
      new BadgeLevelsDesc(
        'moins d\'une heure',
        'de 1 à 3h',
        'de 3 à 6h',
        'de 6 à 12h',
        'plus de 12h'
      ),
      ['1h', '3h', '6h', '12h'],
      'time_spent',
      0,
      0,
      ''
    );
  }

  bronzeLowBound(): number {
    return 60;
  }

  argentLowBound(): number {
    return 180;
  }

  orLowBound(): number {
    return 360;
  }

  rubisLowBound(): number {
    return 720;
  }

  computeDisplayValue(kpi: number): string {
    return new TimePipe().transform(kpi);
  }

  kpiFromStats(stats: QueteurStats): number {
    return stats.time_spent_in_minutes;
  }

}
