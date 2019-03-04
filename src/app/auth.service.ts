import {Injectable, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import * as firebase from 'firebase/app';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User;


  constructor(private angularFireAuth: AngularFireAuth) {
    this.user = this.angularFireAuth.user;
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

  isLoggedIn(): Observable<boolean> {
    return this.user.pipe(map((user, isLoggedIn) => {
      console.log(user);
      return user != null;
    }));
  }

  logout() {
    this.angularFireAuth.auth.signOut()
      .then((res => {
      }));
  }
}
