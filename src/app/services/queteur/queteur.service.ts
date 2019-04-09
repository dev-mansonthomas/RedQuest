import {Injectable} from '@angular/core';
import {FirestoreService} from '../firestore/firestore.service';
import {Queteur} from '../../model/queteur';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class QueteurService {

  currentQueteur: Queteur;

  constructor(private authService: AuthService,
              private firestore: FirestoreService) {
  }

  getQueteur(): Promise<Queteur> {
    return new Promise(resolve => {
        if (this.currentQueteur) {
          resolve(this.currentQueteur);
        } else {
          const user = this.authService.getConnectedUser();
          if (user) {
            this.firestore.getStoredQueteur(this.authService.getConnectedUser().uid).then(queteur => resolve(queteur));
          } else {
            this.authService.onUserConnected().subscribe(
              connectedUser => this.firestore.getStoredQueteur(connectedUser.uid).then(queteur => resolve(queteur))
            );
          }
        }
      }
    );
  }
}
