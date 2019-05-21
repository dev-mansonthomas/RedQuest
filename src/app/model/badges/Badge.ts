import {BadgeLevelsDesc} from './BadgeLevelsDesc';
import {QueteurStats} from '../queteur-stats';

export abstract class Badge {
  constructor(public icon: string,
              public name: string,
              public desc: string,
              public levelDesc: BadgeLevelsDesc,
              public levels: string[],
              public id: string,
              public level: number,
              public progress: number,
              public value: string,
              public more?: string) {

  }

  calculateLevel(kpi: number) {
    if (kpi === 0 || kpi < this.bronzeLowBound()) {
      return 0;
    } else if (kpi < this.argentLowBound()) {
      return 1;
    } else if (kpi < this.orLowBound()) {
      return 2;
    } else if (kpi < this.rubisLowBound()) {
      return 3;
    }
    return 4;
  }

  update(stats: QueteurStats) {
    const kpi = this.kpiFromStats(stats);
    this.level = this.calculateLevel(kpi);
    this.value = this.computeDisplayValue(kpi);
    this.calculateProgressWithTimeout(kpi);
  }

  calculateProgressWithTimeout(kpi: number) {
    setTimeout(() => {
        this.progress = this.computeProgress(kpi);
        console.log(this.id, this.progress);
      },
      Math.random() * 2000 + 1000);
  }

  computeProgress(kpi: number): number {
    if (kpi < this.bronzeLowBound()) {
      return (kpi / this.bronzeLowBound()) * 20;
    }
    if (kpi < this.argentLowBound()) {
      const previousLevelProgression = 20;
      const currentLevelProgression = kpi - this.bronzeLowBound();
      const levelWidth = this.argentLowBound() - this.bronzeLowBound();
      return ((currentLevelProgression / levelWidth) * 20) + previousLevelProgression;
    }
    if (kpi < this.orLowBound()) {
      const previousLevelProgression = 40;
      const currentLevelProgression = kpi - this.argentLowBound();
      const levelWidth = this.orLowBound() - this.argentLowBound();
      return ((currentLevelProgression / levelWidth) * 20) + previousLevelProgression;
    }
    if (kpi < this.rubisLowBound()) {
      const previousLevelProgression = 60;
      const currentLevelProgression = kpi - this.orLowBound();
      const levelWidth = this.rubisLowBound() - this.orLowBound();
      return ((currentLevelProgression / levelWidth) * 20) + previousLevelProgression;
    }
    return 100;
  }

  abstract kpiFromStats(stats: QueteurStats): number;

  abstract computeDisplayValue(kpi: number): string;

  abstract bronzeLowBound(): number;

  abstract argentLowBound(): number;

  abstract orLowBound(): number;

  abstract rubisLowBound(): number;


}
