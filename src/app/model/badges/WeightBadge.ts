import { Badge } from './Badge';
import { BadgeLevelsDesc } from './BadgeLevelsDesc';

import { WeightPipe } from '../../pipes/weight.pipe';
import { QueteurStats } from '../queteur-stats';

export class WeightBadge extends Badge {

  constructor() {
    super(
      'fas fa-weight-hanging',
      'Poids',
      'Quêter le plus lourd possible.',
      new BadgeLevelsDesc(
        'moins de 600g',
        'de 600g à 1.6kg',
        'de 1.6 à 3kg',
        'de 3 à 7kg',
        'plus de 7kg'
      ),
      ['600g', '1.6kg', '3kg', '7kg'],
      'weight',
      0,
      0,
      ''
    );
  }

  bronzeLowBound = () =>  600;
  argentLowBound = () => 1600;
  orLowBound     = () => 3000;
  rubisLowBound  = () => 7000;
  computeDisplayValue = (kpi: number) => new WeightPipe().transform(kpi);
  kpiFromStats = (stats: QueteurStats) => stats.weight;
}
