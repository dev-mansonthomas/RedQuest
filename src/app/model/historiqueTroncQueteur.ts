export class HistoriqueTroncQueteur {
  constructor(
    public amount: number,
    public comptage: string,
    public depart: string,
    public depart_theorique: string,
    public don_cheque: number,
    public don_creditcard: number,
    public id: number,
    public point_quete: string,
    public point_quete_id: number,
    public retour: string,
    public time_spent_in_hours: number,
    public tronc_id: number,
    public weight: number) {

  }

}
