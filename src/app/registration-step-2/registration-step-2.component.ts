import {Component, Input, OnInit} from '@angular/core';
import {User} from "../model/user";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CloudFunctionServiceService} from "../cloud-function-service.service";
import {FirestoreService} from "../firestore.service";

@Component({
  selector: 'app-registration-step-2',
  templateUrl: './registration-step-2.component.html',
  styleUrls: ['./registration-step-2.component.css']
})
export class RegistrationStep2Component implements OnInit {

  @Input() registeredUser: User;
  @Input() isBenevole1j: boolean;
  @Input() userAuthId: string;

  registrationForm: FormGroup;

  constructor(private functions: CloudFunctionServiceService,
              private firestore: FirestoreService) {
  }


  ngOnInit() {
    this.registrationForm = new FormGroup({
      'last_name': new FormControl(this.registeredUser.last_name, Validators.required),
      'first_name': new FormControl(this.registeredUser.first_name, Validators.required),
      'man': new FormControl('1', Validators.required),
      'birth_date': new FormControl(this.registeredUser.birth_date, Validators.required),
      'mobile': new FormControl(this.registeredUser.mobile, [Validators.required, Validators.pattern('[0-9]{9}')]),
      'nivol': new FormControl(this.registeredUser.nivol, Validators.required),
      'secteur': new FormControl({value: this.registeredUser.secteur, disabled: this.isBenevole1j}, Validators.required)
    })
  }

  get last_name() {
    return this.registrationForm.get('last_name');
  }

  get first_name() {
    return this.registrationForm.get('first_name');
  }

  get man() {
    return this.registrationForm.get('man');
  }

  get birth_date() {
    return this.registrationForm.get('birth_date');
  }

  get mobile() {
    return this.registrationForm.get('mobile');
  }

  get nivol() {
    return this.registrationForm.get('nivol');
  }

  get secteur() {
    return this.registrationForm.get('secteur');
  }

  registerUser() {
    Object.assign(this.registeredUser, this.registrationForm.value);
    this.functions.registerQueteur(this.registeredUser)
      .subscribe(
        value => {
          this.registeredUser.queteurId = value.queteur_registration_token;
          this.registeredUser.accountActivated = true;
          this.firestore.registerQueteur(this.userAuthId, this.registeredUser).then(doc => console.log(doc));
        }
      );
  }

}
