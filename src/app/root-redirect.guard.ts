import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RootRedirectGuard implements CanActivate {

  constructor(private router: Router, private angularFireAuth: AngularFireAuth) { }

  canActivate(): Observable<UrlTree> {
    return this.angularFireAuth.user.pipe(
      take(1),
      map(user => this.router.createUrlTree(
        user ? ['/quest/badges'] : ['/registration/needed']
      ))
    );
  }
}
