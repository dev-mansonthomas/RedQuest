export class Badges {
  constructor(public objective_percentage: {level: number, value: string, more?: number},
              public number_of_days: {level: number, value: string},
              public number_of_locations: {level: number, value: string},
              public number_of_troncs: {level: number, value: string},
              public amount_cb: {level: number, value: string},
              public time_spent: {level: number, value: string},
              public weight: {level: number, value: string}) {
  }
}
