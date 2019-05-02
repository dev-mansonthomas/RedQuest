import {Component, OnInit} from '@angular/core';
import {Queteur} from 'src/app/model/queteur';
import {QueteurService} from 'src/app/services/queteur/queteur.service';

@Component({
  selector: 'app-registration-confirmation',
  templateUrl: './registration-confirmation.component.html',
  styleUrls: ['./registration-confirmation.component.scss']
})
export class RegistrationConfirmationComponent implements OnInit {

  queteur: Queteur;

  constructor(private queteurService: QueteurService) {
  }

  ngOnInit() {
    this.queteurService.getQueteur().then(queteur => this.queteur = queteur);
  }

  queteurRegistrationNotApprovedYet(): boolean {
    return this.queteur && this.queteur.registration_approved === null;
  }

  queteurRegistrationRefused() {
    return this.queteur && this.queteur.registration_approved === false;
  }

  queteurRegistrationNotRefused() {
    return this.queteur && this.queteur.registration_approved !== false;
  }

}
