export class User {


  constructor(
    public name: string,
    public firstname: string,
    public gender: string,
    public birthdate: string,
    public email: string,
    public phoneNumber: string
  ) {  }

  static aUser(): User {
    return new User("", "", "", "", "", "")
  }
}
