import {Moment} from 'moment';

export class Tronc {
  constructor(
    public queteur_id: number,
    public tronc_id: number,
    public depart_theorique: Moment,
    public depart?: Moment,
    public arrivee?: Moment
  ) {
  }
}
