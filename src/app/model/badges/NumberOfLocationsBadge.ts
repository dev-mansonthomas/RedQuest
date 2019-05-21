import {Badge} from './Badge';
import {BadgeLevelsDesc} from './BadgeLevelsDesc';
import {QueteurStats} from '../queteur-stats';

export class NumberOfLocationsBadge extends Badge {
  private totalNumberOfLocations = 0;

  constructor() {
    super('fas fa-map-marked-alt',
      'Nombre de lieux',
      'Quêter dans un maximum de points de quête distincts.',
      new BadgeLevelsDesc(
        'si vous n\'avez pas quêté',
        'de 0 à 3 lieux (0 à 30% *)',
        'de 3 à 6 lieux (30 à 60% *)',
        'de 6 à 10 lieux (60 à 80% *)',
        'plus de 10 lieux (plus de 80% *)'
      ),
      ['0', '3', '6', '10'],
      'number_of_locations',
      0,
      0,
      '',
      '* si votre UL a moins de 10 points de quête, tenir compte des pourcentages.');
  }

  bronzeLowBound(): number {
    return 0;
  }

  argentLowBound(): number {
    if (this.totalNumberOfLocations < 10) {
      return 30;
    }
    return 3;
  }

  orLowBound(): number {
    if (this.totalNumberOfLocations < 10) {
      return 30;
    }
    return 6;
  }

  rubisLowBound(): number {
    if (this.totalNumberOfLocations < 10) {
      return 30;
    }
    return 10;
  }

  update(stats: QueteurStats) {
    const kpi = this.kpiFromStats(stats);
    this.level = this.calculateLevel(stats.number_of_point_quete);
    this.value = this.computeDisplayValue(stats.number_of_point_quete);
    this.calculateProgressWithTimeout(kpi);
  }

  computeDisplayValue(kpi: number): string {
    return kpi + ' lieux';
  }

  kpiFromStats(stats: QueteurStats): number {
    this.totalNumberOfLocations = stats.total_number_of_point_quete;
    if (this.totalNumberOfLocations > 10) {
      return stats.number_of_point_quete;
    }
    return stats.number_of_point_quete / this.totalNumberOfLocations * 100;
  }

}
