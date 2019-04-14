import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_USER_NOT_FOUND = 'auth/user-not-found'; // l'utilisateur n'existe pas dans la base de données
  private AUTH_INVALID_EMAIL = 'auth/invalid-email'; // le texte entré par l'utilisateur n'est pas une adresse email
  private AUTH_INVALID_PASSWORD = ''; // Le password n'est pas correct

  private user: Observable<firebase.User>;
  private userDetails: firebase.User;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.user = this.angularFireAuth.user;
    this.user.subscribe(user => this.userDetails = user);
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
            .then(user => user.user.sendEmailVerification());
        }
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.user.pipe(map((user) => {
      return user !== null;
    }));
  }

  onUserConnected(): Observable<firebase.User> {
    return this.user;
  }

  getConnectedUser(): firebase.User {
    return this.userDetails;
  }

  logout() {
    this.angularFireAuth.auth.signOut()
      .then((res => {
      }));
  }

  sendResetPasswordEmail(email: string): Promise<void> {
    return this.angularFireAuth.auth.sendPasswordResetEmail(email);
  }

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