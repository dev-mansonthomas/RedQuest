import { Badge } from './Badge';
import { BadgeLevelsDesc } from './BadgeLevelsDesc';

import { QueteurStats } from '../queteur-stats';

export class ObjectivePercentageBadge extends Badge {

  constructor() {
    super(
      'fas fa-percentage',
      'Objectif de l\'UL',
      'Participer à l\'objectif de l\'UL.',
      new BadgeLevelsDesc(
          '0%',
          'de 0 à 1%',
          'de 1 à 3%',
          'de 3 à 7%',
          'plus de 7%'),
      ['0%', '1%', '3%', '7%'],
      'objective_percentage',
      0,
      0,
      '',
      ''
    );
  }

  bronzeLowBound = () => 0;
  argentLowBound = () => 1;
  orLowBound = () => 3;
  rubisLowBound = () => 7;
  computeDisplayValue = (kpi: number) => `${kpi}%`;
  kpiFromStats = (stats: QueteurStats) => Math.round((stats.amount / stats.amount_year_objective * 100 + Number.EPSILON) * 100) / 100;
}
