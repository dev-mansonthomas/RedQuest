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
        'de 2 à 5 troncs',
        'de 5 à 10 troncs',
        'de 10 à 20 troncs',
        'plus de 20 troncs'
      ),
      ['2x', '5x', '10x', '20x'],
      'number_of_troncs',
      0,
      0,
      ''
    );
  }
  bronzeLowBound = () => 2;
  argentLowBound = () => 5;
  orLowBound = () => 10;
  rubisLowBound = () => 20;
  computeDisplayValue = (kpi: number) => kpi > 1 ? `${kpi} troncs` : `${kpi} tronc`;
  kpiFromStats = (stats: QueteurStats) => stats.number_of_tronc_queteur;
}
