import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.user = this.angularFireAuth.user;
    this.angularFireAuth.auth.getRedirectResult().then(result => {
      this.userDetails = result.user;
    });
    this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
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

  createUserWithEmaiPassword(email: string, password: string) {
    return this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
          this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
        }
      );
  }

  getConnectedUser() {
    return this.user;
  }

  isLoggedIn(): Observable<boolean> {
    return this.user.pipe(map((user, isLoggedIn) => {
      return user != null;
    }));
  }

  getEmailOfConnectedUser(): Observable<firebase.User> {
    return this.user.pipe(map((user, isLoggedIn) => {
      return user;
    }));
  }

  logout() {
    this.angularFireAuth.auth.signOut()
      .then((res => {
      }));
  }
}
