import { Badge } from './Badge';
import { BadgeLevelsDesc } from './BadgeLevelsDesc';

import { TimePipe } from '../../pipes/time.pipe';
import { QueteurStats } from '../queteur-stats';

export class TimeSpentBadge extends Badge {

  constructor() {
    super(
      'fas fa-hourglass',
      'Temps écoulé',
      'Quêter un maximum de temps.',
      new BadgeLevelsDesc(
        'moins d\'une heure',
        'de 1 à 3h',
        'de 3 à 9h',
        'de 9 à 16h',
        'plus de 16h'
      ),
      ['1h', '3h', '9h', '16h'],
      'time_spent',
      0,
      0,
      ''
    );
  }

  bronzeLowBound = () => 60;
  argentLowBound = () => 3*60;
  orLowBound = () => 9*60;
  rubisLowBound = () => 16*60;
  computeDisplayValue = (kpi: number) => new TimePipe().transform(kpi);
  kpiFromStats = (stats: QueteurStats) => stats.time_spent_in_minutes;
}
