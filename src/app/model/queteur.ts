export class Queteur {

  constructor(
    public last_name: string,
    public first_name: string,
    public man: number,
    public birthdate: string,
    public email: string,
    public mobile: string,
    public secteur: number,
    public nivol: string,
    public ul_registration_token: string,
    public queteur_id: number,
    public registration_approved: boolean,
    public reject_reaseon: string,
    public queteur_registration_token: string
  ) {
  }

  static aUser(): Queteur {
    return new Queteur('', '', 1, '', '', '', 3, '', '', 0, null, '', '');
  }
}