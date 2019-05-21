import {Badge} from './Badge';
import {QueteurStats} from '../queteur-stats';
import {BadgeLevelsDesc} from './BadgeLevelsDesc';

export class AmountCbBadge extends Badge {

  constructor() {
    super(
      'fas fa-credit-card',
      'Sans contact ?',
      'Quêter un maximum de fois par CB.',
      new BadgeLevelsDesc(
        'moins de 5€',
        'de 5 à 100 €',
        'de 100 à 300€',
        'de 300 à 500€',
        'plus de 500€'
      ),
      ['5€', '100€', '300€', '500€'],
      'amount_cb',
      0,
      0,
      ''
    );
  }

  bronzeLowBound(): number {
    return 5.0;
  }

  argentLowBound(): number {
    return 100.0;
  }

  orLowBound(): number {
    return 300.0;
  }

  rubisLowBound(): number {
    return 500.0;
  }

  computeDisplayValue(kpi: number): string {
    return kpi + '€';
  }

  kpiFromStats(stats: QueteurStats): number {
    return stats.amount_cb;
  }

}
