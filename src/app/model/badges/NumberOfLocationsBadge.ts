import { Badge } from './Badge';
import { BadgeLevelsDesc } from './BadgeLevelsDesc';

import { QueteurStats } from '../queteur-stats';

export class NumberOfLocationsBadge extends Badge {
  private totalNumberOfLocations = 0;

  constructor() {
    super('fas fa-map-marked-alt',
      'Nombre de lieux',
      'Quêter dans un maximum de points de quête distincts.',
      new BadgeLevelsDesc(
        'si vous n\'avez pas quêté',
        'de 0 à 2 lieux (0 à 30% *)',
        'de 2 à 4 lieux (30 à 60% *)',
        'de 4 à 6 lieux (60 à 80% *)',
        'plus de 6 lieux (plus de 80% *)'
      ),
      ['0', '2', '4', '6'],
      'number_of_locations',
      0,
      0,
      '',
      '* si votre UL a moins de 10 points de quête, tenir compte des pourcentages.');
  }

  bronzeLowBound = () => 0;
  argentLowBound = () => this.totalNumberOfLocations < 10 ? 30 : 2;
  orLowBound = () => this.totalNumberOfLocations < 10 ? 30 : 4;
  rubisLowBound = () => this.totalNumberOfLocations < 10 ? 30 : 6;
  computeDisplayValue = (kpi: number) => kpi > 1 ? `${kpi} lieux` : `${kpi} lieu`;
  kpiFromStats(stats: QueteurStats): number {
    this.totalNumberOfLocations = stats.total_number_of_point_quete;
    if (this.totalNumberOfLocations > 10) {
      return stats.number_of_point_quete;
    }
    return stats.number_of_point_quete / this.totalNumberOfLocations * 100;
  }
  update(stats: QueteurStats) {
    const kpi = this.kpiFromStats(stats);
    this.level = this.calculateLevel(stats.number_of_point_quete);
    this.value = this.computeDisplayValue(stats.number_of_point_quete);
    this.calculateProgressWithTimeout(kpi);
  }

}
