import {QueteurStats} from '../queteur-stats';
import {Badge} from './Badge';
import {BadgeLevelsDesc} from './BadgeLevelsDesc';


export class ObjectivePercentageBadge extends Badge {

  constructor() {
    super(
      'fas fa-percentage',
      'Objectif de l\'UL',
      'Participer à l\'objectif de l\'UL.',
      new BadgeLevelsDesc('0%', 'de 0 à 2%', 'de 2 à 4%', 'de 4 à 8%', 'plus de 8%'),
      ['0%', '2%', '4%', '8%'],
      'objective_percentage',
      0,
      0,
      '',
      ''
    );
  }

  bronzeLowBound(): number {
    return 0;
  }

  argentLowBound(): number {
    return 2;
  }

  orLowBound(): number {
    return 4;
  }

  rubisLowBound(): number {
    return 8;
  }

  computeDisplayValue(kpi: number): string {
    return kpi + '%';
  }

  kpiFromStats(stats: QueteurStats): number {
    return stats.amount / stats.amount_year_objective * 100;
  }

}
