export class ULStats {
  constructor(
  public amount: number,
  public amount_cb: number,
  public amount_year_objective: number,
  public number_of_days_quete: number,
  public number_of_point_quete: number,
  public number_of_tronc_queteur: number,
  public time_spent_in_minutes: number,
  public total_number_of_point_quete: number,
  public ul_id: number,
  public weight: number,
  public year: number
  ) {}

  static aULStats(): ULStats {
    return new ULStats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
