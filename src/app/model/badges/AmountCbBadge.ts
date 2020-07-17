import { Badge } from './Badge';
import { QueteurStats } from '../queteur-stats';
import { BadgeLevelsDesc } from './BadgeLevelsDesc';

export class AmountCbBadge extends Badge {

    constructor() {
        super(
            'fas fa-credit-card',
            'Sans contact ?',
            'Quêter un maximum de fois par CB.',
            new BadgeLevelsDesc(
                'moins de 5€',
                'de 5 à 100 €',
                'de 100 à 300€',
                'de 300 à 500€',
                'plus de 500€'
            ),
            ['5€', '100€', '300€', '500€'],
            'amount_cb',
            0,
            0,
            ''
        );
    }
    bronzeLowBound = () => 5.0;
    argentLowBound = () => 100.0;
    orLowBound = () => 300.0;
    rubisLowBound = () => 500.0;
    computeDisplayValue = (kpi: number) => `${kpi} €`;
    kpiFromStats = (stats: QueteurStats) => stats.amount_cb;
}
