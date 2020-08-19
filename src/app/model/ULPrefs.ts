export class ULPrefs {
  public badges: any;
  constructor(
    public ul_id: number,
    public rq_display_daily_stats: boolean,
    public rq_display_queteur_ranking: string,
    public rq_autonomous_depart_and_return: boolean

  ) {
  }

  static aULPrefs(): ULPrefs {
    return new ULPrefs(
        1,
      true,
      'ALL',
      false
    );
  }
}
