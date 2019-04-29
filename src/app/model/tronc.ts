import {Moment} from 'moment';

export class Tronc {
  constructor(
    public tronc_queteur_id: number,
    public queteur_id: number,
    public point_quete_id: number,
    public tronc_id: number,
    public depart_theorique: Moment,
    public depart: Moment,
    public arrivee: Moment,
    public name: string,
    public latitude: number,
    public longitude: number,
    public address: string,
    public postal_code: string,
    public city: string,
    public advice: string,
    public localization: string
  ) {
  }
}
