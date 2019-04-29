import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {Queteur} from '../../model/queteur';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CloudFunctionService} from '../../services/cloud-functions/cloud-function.service';
import {FirestoreService} from '../../services/firestore/firestore.service';
import {WaitingModalComponent} from '../waiting-modal/waiting-modal.component';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-registration-step-2',
  templateUrl: './registration-step-2.component.html',
  styleUrls: ['./registration-step-2.component.css']
})
export class RegistrationStep2Component implements OnInit {

  @Input() registeredUser: Queteur;
  @Input() isBenevole1j: boolean;
  @Input() userAuthId: string;
  @ViewChild(WaitingModalComponent) waitingModal;

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

  get secteur() {
    return this.registrationForm.get('secteur');
  }

  error: string;

  constructor(private router: Router,
              private zone: NgZone,
              private functions: CloudFunctionService,
              private firestore: FirestoreService) {
  }


  ngOnInit() {
    this.registrationForm = new FormGroup({
      'last_name': new FormControl(this.registeredUser.last_name, Validators.required),
      'first_name': new FormControl(this.registeredUser.first_name, Validators.required),
      'man': new FormControl(1, Validators.required),
      'birthdate': new FormControl(this.registeredUser.birthdate, [Validators.required,
        Validators.pattern('((0[1-9])|((1|2)[0-9])|30|31)\/(10|11|12|0[1-9])\/[1-2](9|0)[0-9][0-9]')]),
      'mobile': new FormControl(this.registeredUser.mobile, [Validators.required, Validators.pattern('[0-9]{9}')]),
      'nivol': !this.isBenevole1j
        ? new FormControl(this.registeredUser.nivol, [Validators.required, Validators.pattern('[1-9][0-9]{3,11}[A-Z]')])
        : new FormControl(),
      'secteur': new FormControl({value: this.registeredUser.secteur, disabled: this.isBenevole1j}, Validators.required)
    });
  }

  registerUser() {
    Object.assign(this.registeredUser, this.registrationForm.value);
    this.registeredUser.birthdate = moment(this.registeredUser.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.registeredUser.mobile = '+33' + this.registeredUser.mobile;
    this.functions.registerQueteur(this.registeredUser)
      .subscribe(token => {
        this.registeredUser.queteur_registration_token = token.queteur_registration_token;
        this.firestore.registerQueteur(this.userAuthId, this.registeredUser)
          .then(() => this.closeModalAndConfirmRegistration())
          .catch(onrejected => {
            this.closeModalAndDisplayError();
            console.log(onrejected);
            throw onrejected;
          });
      });
  }

  closeModalAndConfirmRegistration() {
    this.waitingModal.close();
    this.zone.run(() => this.router.navigate(['registration-confirmation']));
  }

  closeModalAndDisplayError() {
    this.waitingModal.close();
    this.error = 'Erreur lors de l\'inscription !';
  }


}
