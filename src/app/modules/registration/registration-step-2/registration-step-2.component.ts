import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { Queteur } from '../../../model/queteur';
import { CloudFunctionService } from '../../../services/cloud-functions/cloud-function.service';
import { FirestoreService } from '../../../services/firestore/firestore.service';

@Component({
  selector: 'app-registration-step-2',
  templateUrl: './registration-step-2.component.html'
})
export class RegistrationStep2Component implements OnInit {

  @Input() registeredUser: Queteur;
  @Input() isBenevole1j: boolean;
  @Input() userAuthId: string;

  loading = false;

  registrationForm: FormGroup;

  get last_name() {
    return this.registrationForm.get('last_name');
  }

  get first_name() {
    return this.registrationForm.get('first_name');
  }

  get man() {
    return this.registrationForm.get('man');
  }

  get birthdate() {
    return this.registrationForm.get('birthdate');
  }

  get mobile() {
    return this.registrationForm.get('mobile');
  }

  get nivol() {
    return this.registrationForm.get('nivol');
  }

  get benevole_referent() {
    return this.registrationForm.get('benevole_referent');
  }

  get secteur() {
    return this.registrationForm.get('secteur');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  error: string;

  constructor(
    private router: Router, private zone: NgZone, private functions: CloudFunctionService, private firestore: FirestoreService) { }


  ngOnInit() {
    this.registrationForm = new FormGroup(
      {
        'last_name': new FormControl(this.registeredUser.last_name, Validators.required),
        'first_name': new FormControl(this.registeredUser.first_name, Validators.required),
        'man': new FormControl(1, Validators.required),
        'email': new FormControl({ value: this.registeredUser.email, disabled: this.registeredUser.email },
          [Validators.required, Validators.email]),
        'birthdate': new FormControl(this.registeredUser.birthdate, Validators.required),
        'mobile': new FormControl(this.registeredUser.mobile, {validators:[Validators.required, Validators.pattern('[0-9]{9}')], updateOn: 'blur'}),
        'nivol': !this.isBenevole1j
          ? new FormControl(this.registeredUser.nivol, {validators:
                    [
                        Validators.required,
                        Validators.pattern('[1-9][0-9]{3,11}[a-zA-Z]')
                    ], updateOn: 'blur'})
          : new FormControl(null,{ updateOn: 'blur' }),
        'benevole_referent': new FormControl(),
        'secteur': new FormControl({ value: this.registeredUser.secteur, disabled: this.isBenevole1j }, Validators.required)
      });

      this.mobile.valueChanges.subscribe(p => this.mobile.setValue(p.replace(/^0+/, ''), { emitEvent: false}));
      this.nivol.valueChanges.subscribe(p => this.nivol.setValue(p.replace(/^0+/, ''), { emitEvent: false}));
  }

  registerUser() {
    this.loading = true;
    this.firestore.isQueteurAlreadyRegistered(this.nivol.value as string)
      .then(alreadyRegistered => {
        if (alreadyRegistered) {
          this.error = `Vous êtes déjà inscris sous cette adresse: ${alreadyRegistered.email}`;
          this.loading = false;
          return;
        }
        Object.assign(this.registeredUser, this.registrationForm.value);
        this.registeredUser.birthdate = moment(new Date(this.registeredUser.birthdate)).format('YYYY-MM-DD');
        this.registeredUser.mobile = '+33' + this.registeredUser.mobile;
        if (this.registeredUser.nivol) {
          this.registeredUser.nivol = this.registeredUser.nivol.toUpperCase();
        }
        this.functions.registerQueteur$(this.registeredUser) //store the registration in RCQ Backend
          .subscribe(token => {
            this.registeredUser.queteur_registration_token = token.queteur_registration_token;
            this.storeNewQueteur();//store in RedQuest Firestore
          });
      });
  }

  private storeNewQueteur() {
    this.firestore.registerQueteur(this.userAuthId, this.registeredUser)
      .then(() => this.closeModalAndConfirmRegistration())
      .catch(onrejected => {
        this.closeModalAndDisplayError();
        throw onrejected;
      });
  }

  closeModalAndConfirmRegistration() {
    this.loading = false;
    this.zone.run(() => this.router.navigate(['registration/confirmation']));
  }

  closeModalAndDisplayError() {
    this.loading = false;
    this.error = 'Erreur lors de l\'inscription !';
  }
}
