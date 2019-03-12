export class User {


  constructor(
    public last_name: string,
    public first_name: string,
    public man: number,
    public birth_date: string,
    public email: string,
    public mobile: string,
    public secteur: number,
    public nivol: string,
    public ul_registration_token: string
  ) {
  }

  static aUser(): User {
    return new User('', '', 1, '', '', '', 3, '', '');
  }
}
