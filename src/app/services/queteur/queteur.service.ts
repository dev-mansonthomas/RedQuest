import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY, Subscriber } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { FirestoreService } from '../firestore/firestore.service';

import { Queteur } from '../../model/queteur';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class QueteurService {

  currentQueteur: Queteur;

  constructor(private authService: AuthService, private firestore: FirestoreService) { }

  getQueteur(): Observable<Queteur> {
    console.log('QueteurService getQueteur');
    const gotIt = <T>(o: Subscriber<T>, q: T) => { o.next(q); o.complete(); };
    return new Observable(observer => {
      if (this.currentQueteur) {
        console.log('QueteurService getQueteur currentQueteur:', this.currentQueteur);
        gotIt<Queteur>(observer, this.currentQueteur);
      } else {
        const user = this.authService.getConnectedUser();
        if (user) {
          console.log('QueteurService getQueteur user:', user);
          this.firestore.getStoredQueteur(this.authService.getConnectedUser().uid)
            .then(queteur => gotIt<Queteur>(observer, queteur))
            .catch(() => observer.error('Queteur is not found'));
        } else {
          this.authService.onUserConnected().subscribe(connectedUser => {
            if (connectedUser) {
              console.log('QueteurService getQueteur connectedUser:', connectedUser.uid);
              this.firestore.getStoredQueteur(this.authService.getConnectedUser().uid)
                .then(queteur => gotIt<Queteur>(observer, queteur))
                .catch(() => observer.error('Queteur is not found'));
            } else {
              observer.error('Queteur is not found');
            }
          });
        }
      }
    });
  }
}
@Injectable({
  providedIn: 'root'
})
export class QueteurResolverService implements Resolve<Queteur> {
  constructor(private qs: QueteurService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Queteur> | Observable<never> {
    console.log('QueteurResolverService resolve');
    return this.qs.getQueteur().pipe(
      take(1),
      mergeMap(queteur => {
        if (queteur) {
          return of(queteur);
        }
        console.error('QueteurResolverService not found', queteur);
        this.router.navigate(['/login']);
        return EMPTY;
      }));
  }
}