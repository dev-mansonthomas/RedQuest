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
    return new Promise((resolve, error) => {
        if (this.currentQueteur) {
          resolve(this.currentQueteur);
        } else {
          this.retrieveQueteur(resolve, error);
        }
      }
    );
  }

  private retrieveQueteur(resolve, error) {
    const user = this.authService.getConnectedUser();
    if (user) {
      this.firestore.getStoredQueteur(this.authService.getConnectedUser().uid)
        .then(queteur => resolve(queteur))
        .catch(() => error());
    } else {
      this.waitForAuthentication(resolve, error);
    }
  }

  private waitForAuthentication(resolve, error) {
    this.authService.onUserConnected().subscribe(
      connectedUser => {
        if (connectedUser) {
          this.firestore.getStoredQueteur(connectedUser.uid).then(queteur => {
            if (queteur) {
              resolve(queteur);
            } else {
              error();
            }
          });
        } else {
          error();
        }
      }
    );
  }
}
