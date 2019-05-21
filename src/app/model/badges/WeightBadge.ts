import { Badge } from './Badge';
import { QueteurStats } from '../queteur-stats';
import { BadgeLevelsDesc } from './BadgeLevelsDesc';
import { WeightPipe } from '../../pipes/weight.pipe';

export class WeightBadge extends Badge {

  constructor() {
    super(
      'fas fa-weight-hanging',
      'Poids',
      'Quêter le plus lourd possible.',
      new BadgeLevelsDesc(
        'moins de 600g',
        'de 600g à 5kg',
        'de 5 à 15kg',
        'de 15 à 30kg',
        'plus de 30kg'
      ),
      ['600kg', '5kg', '15kg', '30kg'],
      'weight',
      0,
      0,
      ''
    );
  }

  bronzeLowBound = () => 600;
  argentLowBound = () => 5000;
  orLowBound = () => 15000;
  rubisLowBound = () => 30000;
  computeDisplayValue = (kpi: number) => new WeightPipe().transform(kpi);
  kpiFromStats = (stats: QueteurStats) => stats.weight;
}
