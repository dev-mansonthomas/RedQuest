import {Badge} from './Badge';
import {BadgeLevelsDesc} from './BadgeLevelsDesc';
import {QueteurStats} from '../queteur-stats';

export class NumberOfDaysBadge extends Badge {

  constructor() {
    super('fas fa-calendar',
      'Nombre de jours',
      'Quêter un maximum de jours.',
      new BadgeLevelsDesc(
        'si vous n\'avez pas quêté',
        'de 1 à 4 jours',
        'de 4 à 7 jours',
        'de 7 à 9 jours',
        'tous les jours'
      ),
      ['1j', '4j', '7j', '9j'],
      'number_of_days',
      0,
      0,
      ''
    );
  }

  bronzeLowBound(): number {
    return 1;
  }

  argentLowBound(): number {
    return 4;
  }

  orLowBound(): number {
    return 7;
  }

  rubisLowBound(): number {
    return 9;
  }

  computeDisplayValue(kpi: number): string {
    return kpi + ' jours';
  }

  kpiFromStats(stats: QueteurStats): number {
    return stats.number_of_days_quete;
  }
}
