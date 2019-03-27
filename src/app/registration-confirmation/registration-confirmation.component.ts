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

  constructor(private authService: AuthService,
              private firestore: FirestoreService) {
  }

  ngOnInit() {
    const user = this.authService.getConnectedUser();
    if (user) {
      this.firestore.getQueteur(this.authService.getConnectedUser().uid).then(queteur => this.queteur = queteur);
    } else {
      this.authService.onUserConnected().subscribe(
        connectedUser => this.firestore.getQueteur(connectedUser.uid).then(queteur => this.queteur = queteur)
      );
    }
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
