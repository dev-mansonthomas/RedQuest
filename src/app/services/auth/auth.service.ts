import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { auth, User } from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_USER_NOT_FOUND = 'auth/user-not-found'; // l'utilisateur n'existe pas dans la base de données
  private AUTH_INVALID_EMAIL = 'auth/invalid-email'; // le texte entré par l'utilisateur n'est pas une adresse email
  private AUTH_INVALID_PASSWORD = ''; // Le password n'est pas correct
  private AUTH_ACCOUNT_ALREADY_EXISTING = 'auth/email-already-in-use';

  private userDetails: User;

  constructor(private router: Router, private angularFireAuth: AngularFireAuth) {
    this.angularFireAuth.getRedirectResult().then(result => {
      this.userDetails = result.user;
    });
    this.angularFireAuth.setPersistence('local');
  }

  signInGoogleLogin() {
    return this.angularFireAuth.setPersistence('local')
      .then(() => {
        this.angularFireAuth.signInWithRedirect(
          new auth.GoogleAuthProvider()
        );
      }
      );
  }

  signInFacebookLogin() {
    return this.angularFireAuth.setPersistence('local')
      .then(() => {
        this.angularFireAuth.signInWithRedirect(
          new auth.FacebookAuthProvider()
        );
      }
      );
  }

  signInWithEmailPassword(email: string, password: string) {
    return this.angularFireAuth.setPersistence('local')
      .then(() => {
        return this.angularFireAuth.signInWithEmailAndPassword(email, password);
      }
      );
  }

  createUserWithEmailPassword(email: string, password: string) {
    return this.angularFireAuth.setPersistence('local')
      .then(() => {
        this.angularFireAuth.createUserWithEmailAndPassword(email, password)
          // .then(user => user.user.sendEmailVerification()) disabled for 2018
          .catch(error => {
            if (error.code === this.AUTH_ACCOUNT_ALREADY_EXISTING) {
              this.signInWithEmailPassword(email, password);
            }
          });
      });
  }

  isLoggedIn(redirect = true): Observable<boolean> {
    return this.angularFireAuth.user.pipe(map((user) => {
      if (user !== null) {
        return true;
      }
      if (redirect) {
        this.router.navigate(['/login']);
      }
      return false;
    }));
  }

  onUserConnected = (): Observable<firebase.User> => this.angularFireAuth.user;
  getConnectedUser = (): firebase.User => this.userDetails;

  logout = () => this.angularFireAuth.signOut().then(() => this.router.navigate(['/login']));
  sendResetPasswordEmail = (email: string): Promise<void> => this.angularFireAuth.sendPasswordResetEmail(email);

  public handleAuthError(error): string {
    switch (error.code) {
      case this.AUTH_INVALID_EMAIL:
        return 'l\'email entré n\'est pas une adresse email valide';
      case this.AUTH_USER_NOT_FOUND:
        return 'l\'utilisateur n\'existe pas dans l\'application';
      default:
        return 'erreur inconnue';
    }
  }
}
