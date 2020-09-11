import { Badge } from './Badge';
import { BadgeLevelsDesc } from './BadgeLevelsDesc';

import { QueteurStats } from '../queteur-stats';

export class NumberOfDaysBadge extends Badge {

  constructor() {
    super('fas fa-calendar',
      'Nombre de jours',
      'Quêter un maximum de jours.',
      new BadgeLevelsDesc(
        'si vous n\'avez pas quêté',
        'de 1 à 2 jours',
        'de 3 à 4 jours',
        'de 5 à 6 jours',
        'tous les jours'
      ),
      ['1j', '3j', '5j', '7j'],
      'number_of_days',
      0,
      0,
      ''
    );
  }

  bronzeLowBound = () => 1;
  argentLowBound = () => 3;
  orLowBound = () => 5;
  rubisLowBound = () => 7;
  computeDisplayValue = (kpi: number) => kpi > 1 ? `${kpi} jours` : `${kpi} jour`;
  kpiFromStats = (stats: QueteurStats) => stats.number_of_days_quete;
}
