export class QueteurStats {
  constructor(
    public amount: number,
    public amount_year_objective: number,
    public number_of_days_quete: number,
    public number_of_point_quete: number,
    public number_of_tronc_queteur: number,
    public total_number_of_point_quete: number,
    public amount_cb: number,
    public first_name: string,
    public last_name: string,
    public queteur_id: number,
    public time_spent_in_minutes: number,
    public tronc_count: number,
    public ul_id: number,
    public unique_point_quete_count: number,
    public weight: number,
    public year: number
  ) {
  }

}
