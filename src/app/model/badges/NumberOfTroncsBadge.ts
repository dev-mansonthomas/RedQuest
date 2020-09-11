import { Badge } from './Badge';
import { BadgeLevelsDesc } from './BadgeLevelsDesc';

import { QueteurStats } from '../queteur-stats';

export class NumberOfTroncsBadge extends Badge {

  constructor() {
    super(
      'fas fa-running',
      'Nombre de troncs',
      'Quêter un maximum de fois.',
      new BadgeLevelsDesc(
        '0 ou 1 tronc',
        'de 2 à 4 troncs',
        'de 4 à 8 troncs',
        'de 8 à 12 troncs',
        'plus de 12 troncs'
      ),
      ['2x', '4x', '8x', '12x'],
      'number_of_troncs',
      0,
      0,
      ''
    );
  }
  bronzeLowBound = () => 2;
  argentLowBound = () => 4;
  orLowBound = () => 8;
  rubisLowBound = () => 12;
  computeDisplayValue = (kpi: number) => kpi > 1 ? `${kpi} troncs` : `${kpi} tronc`;
  kpiFromStats = (stats: QueteurStats) => stats.number_of_tronc_queteur;
}
