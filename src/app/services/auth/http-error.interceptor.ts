import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export type CloudFunctionErrorKind =
  | 'network'      // status 0 → CORS, offline, DNS, browser blocked
  | 'unauthorized' // 401 → token expired/invalid
  | 'forbidden'    // 403 → token valid but insufficient rights
  | 'not-found'    // 404 → endpoint deployed under a different name
  | 'client'       // other 4xx
  | 'server'       // 5xx
  | 'unknown';

export interface CloudFunctionError {
  kind: CloudFunctionErrorKind;
  status: number;
  url: string;
  message: string;
  timestamp: Date;
  original: HttpErrorResponse;
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  private readonly cloudFunctionsBaseUrl = environment.cloudFunctionsBaseUrl;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.shouldHandle(req.url)) {
      return next.handle(req);
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const enriched = this.classify(err);
        console.warn(
          `[cf-error] ${enriched.kind} status=${enriched.status} url=${enriched.url}`,
          enriched.message
        );
        return throwError(enriched);
      })
    );
  }

  private shouldHandle(url: string): boolean {
    return !!this.cloudFunctionsBaseUrl && url.startsWith(this.cloudFunctionsBaseUrl);
  }

  private classify(err: HttpErrorResponse): CloudFunctionError {
    const status = err.status || 0;
    let kind: CloudFunctionErrorKind;
    if (status === 0) {
      kind = 'network';
    } else if (status === 401) {
      kind = 'unauthorized';
    } else if (status === 403) {
      kind = 'forbidden';
    } else if (status === 404) {
      kind = 'not-found';
    } else if (status >= 400 && status < 500) {
      kind = 'client';
    } else if (status >= 500) {
      kind = 'server';
    } else {
      kind = 'unknown';
    }
    return {
      kind,
      status,
      url: err.url || '',
      message: this.extractMessage(err),
      timestamp: new Date(),
      original: err
    };
  }

  private extractMessage(err: HttpErrorResponse): string {
    if (err.error && typeof err.error === 'object' && typeof (err.error as any).error === 'string') {
      return (err.error as any).error;
    }
    if (typeof err.error === 'string') {
      return err.error;
    }
    return err.message || err.statusText || 'Erreur inconnue';
  }
}
