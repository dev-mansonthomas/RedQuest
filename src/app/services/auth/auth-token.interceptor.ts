import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, from, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  private readonly cloudFunctionsBaseUrl = environment.cloudFunctionsBaseUrl;

  constructor(private angularFireAuth: AngularFireAuth) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.shouldInjectToken(req.url)) {
      return next.handle(req);
    }

    return from(this.angularFireAuth.currentUser).pipe(
      take(1),
      switchMap(user => user ? from(user.getIdToken()) : of<string | null>(null)),
      switchMap(token => {
        if (!token) {
          return next.handle(req);
        }
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next.handle(authReq);
      })
    );
  }

  private shouldInjectToken(url: string): boolean {
    return !!this.cloudFunctionsBaseUrl && url.startsWith(this.cloudFunctionsBaseUrl);
  }
}
