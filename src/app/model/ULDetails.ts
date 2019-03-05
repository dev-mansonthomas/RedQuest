export class ULDetails {
  settings_id: number;
  token_benevole: string;
  token_benevole_1j: string;
  ul_id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  postal_code: string;
  city: string;
  email: string;

  constructor(json: any) {
    this.settings_id = json.settings_id;
    this.token_benevole = json.token_benevole;
    this.token_benevole_1j = json.token_benevole_1j;
    this.ul_id = json.ul_id;
    this.name = json.name;
    this.latitude = json.latitude;
    this.longitude = json.longitude;
    this.address = json.address;
    this.postal_code = json.postal_code;
    this.city = json.city;
    this.email = json.mail;
  }
}
