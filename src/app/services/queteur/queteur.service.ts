import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { of, EMPTY, Observable, Subscriber } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { Queteur } from '../../model/queteur';
import { AuthService } from '../auth/auth.service';
import { CloudFunctionService } from '../cloud-functions/cloud-function.service';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class QueteurService {

  currentQueteur: Queteur;

  constructor(private authService: AuthService,
    private firestore: FirestoreService,
    private cloudFunctions: CloudFunctionService,
    private router: Router) {
  }

  gotIt = <T>(o: Subscriber<T>, q: T) => {
    o.next(q);
    o.complete();
  }

  getQueteur(): Observable<Queteur> {
    return new Observable(observer => {
      if (this.currentQueteur)
      {
        console.log('QueteurService getQueteur currentQueteur:', this.currentQueteur);
        this.gotIt<Queteur>(observer, this.currentQueteur);
      }
      else
      {
        const user = this.authService.getConnectedUser();
        if (user && user.uid)
        {
          this.updateAndRetrieveQueteur(user.uid, observer);
        }
        else
        {
          this.authService.onUserConnected().subscribe(connectedUser => {
            if (connectedUser && connectedUser.uid)
            {
              this.updateAndRetrieveQueteur(connectedUser.uid, observer);
            }
            else
            {
              observer.error('User is not authenticated');
            }
          });
        }
      }
    });
  }

  private updateAndRetrieveQueteur(authId, observer) {
    this.retrieveQueteur(authId, observer);
    // this.cloudFunctions.findQueteurById() // not useful yet, see you next year
    //   .subscribe(
    //     () => this.retrieveQueteur(authId, observer),
    //     () => this.retrieveQueteur(authId, observer) // on error, no update but retrieve queteur
    //   );
  }

  private retrieveQueteur(authId, observer) {
    console.log('QueteurService getQueteur user:', authId);
    this.firestore.getStoredQueteur(authId)
      .then(queteur => {
        queteur.queteur_id = Number(queteur.queteur_id);
        this.gotIt<Queteur>(observer, queteur);
      })
      .catch((exception) => {
        observer.error('Queteur is not found '+exception);
        if (window.location.pathname.indexOf('login') !== -1) {
          this.router.navigate(['registration/needed']);
        }
      });
  }
}

@Injectable({
  providedIn: 'root'
})
export class QueteurResolverService implements Resolve<Queteur> {
  constructor(private qs: QueteurService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Queteur> | Observable<never> {
    console.log('QueteurResolverService resolve');
    return this.qs.getQueteur().pipe(
      take(1),
      mergeMap(queteur => {
        if (queteur?.registration_approved) {
          return of(queteur);
        } else if (queteur) {
          this.router.navigate(['registration/confirmation']);
          return EMPTY;
        }
        console.error('QueteurResolverService not found', queteur);
        this.router.navigate(['/registration/needed']);
        return EMPTY;
      }));
  }
}


@Injectable({
  providedIn: 'root'
})
export class RegisteredQueteurResolverService implements Resolve<Queteur> {
  constructor(private qs: QueteurService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Queteur> | Observable<never> {
    console.log('RegisteredQueteurResolverService resolve');
    return this.qs.getQueteur().pipe(
        take(1),
        mergeMap(queteur => {
          if (queteur)
          {
            if (queteur.registration_approved)
            {
              this.router.navigate(['/']);
              return EMPTY;
            }

            return of(queteur);
          }
          const url = route.url.toString();
          console.error('QueteurResolverService not found on route '+url, queteur);
          this.router.navigate(['/registration/needed']);
          return EMPTY;
        }));
  }
}
