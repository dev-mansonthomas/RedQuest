import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';
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

  private user: Observable<firebase.User>;
  private userDetails: firebase.User;

  constructor(private router: Router, private angularFireAuth: AngularFireAuth) {
    this.user = this.angularFireAuth.user;
    this.user.subscribe(user => {
      this.userDetails = user;
    });
    this.angularFireAuth.auth.getRedirectResult().then(result => {
      this.userDetails = result.user;
    });
    this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  signInGoogleLogin() {
    return this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        this.angularFireAuth.auth.signInWithRedirect(
          new firebase.auth.GoogleAuthProvider()
        );
      }
      );
  }

  signInTwitterLogin() {
    return this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        this.angularFireAuth.auth.signInWithRedirect(
          new firebase.auth.TwitterAuthProvider()
        );
      }
      );
  }

  signInFacebookLogin() {
    return this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        this.angularFireAuth.auth.signInWithRedirect(
          new firebase.auth.FacebookAuthProvider()
        );
      }
      );
  }

  signInWithEmailPassword(email: string, password: string) {
    return this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
      }
      );
  }

  createUserWithEmailPassword(email: string, password: string) {
    return this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
          // .then(user => user.user.sendEmailVerification()) disabled for 2018
          .catch(error => {
            if (error.code === this.AUTH_ACCOUNT_ALREADY_EXISTING) {
              this.signInWithEmailPassword(email, password);
            }
          });
      });
  }

  isLoggedIn(redirect = true): Observable<boolean> {
    return this.user.pipe(map((user) => {
      if (user !== null) {
        return true;
      }
      if (redirect) {
        this.router.navigate(['/login']);
      }
      return false;
    }));
  }

  onUserConnected = (): Observable<firebase.User> => this.user;
  getConnectedUser = (): firebase.User => this.userDetails;

  logout = () => this.angularFireAuth.auth.signOut().then(() => this.router.navigate(['/login']));
  sendResetPasswordEmail = (email: string): Promise<void> => this.angularFireAuth.auth.sendPasswordResetEmail(email);

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
