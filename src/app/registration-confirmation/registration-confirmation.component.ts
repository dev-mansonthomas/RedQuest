import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FirestoreService} from '../firestore.service';
import {User} from '../model/user';

@Component({
  selector: 'app-registration-confirmation',
  templateUrl: './registration-confirmation.component.html',
  styleUrls: ['./registration-confirmation.component.css']
})
export class RegistrationConfirmationComponent implements OnInit {

  queteur: User;

  constructor(private firestore: FirestoreService) {
  }

  ngOnInit() {
    this.firestore.getQueteur().then(queteur => this.queteur = queteur);
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
