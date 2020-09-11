import { Badge } from './Badge';
import { BadgeLevelsDesc } from './BadgeLevelsDesc';

import { QueteurStats } from '../queteur-stats';

export class AmountCbBadge extends Badge {

  constructor() {
    super(
      'fas fa-credit-card',
      'Sans contact ?',
      'Quêter un max avec le terminal CB.',
      new BadgeLevelsDesc(
        'moins de 10€',
        'de 10 à 40 €',
        'de 40 à 100€',
        'de 100 à 250€',
        'plus de 250€'
      ),
      ['10€', '40€', '100€', '250€'],
      'amount_cb',
      0,
      0,
      ''
    );
  }
  bronzeLowBound = () => 10.0;
  argentLowBound = () => 40.0;
  orLowBound = () => 100.0;
  rubisLowBound = () => 250.0;
  computeDisplayValue = (kpi: number) => `${kpi} €`;
  kpiFromStats = (stats: QueteurStats) => stats.amount_cb;
}
