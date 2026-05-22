import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { CloudFunctionError, HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {

  const baseUrl = environment.cloudFunctionsBaseUrl;
  const targetUrl = `${baseUrl}register-queteur`;
  const externalUrl = 'https://maps.googleapis.com/maps/api/js';

  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function expectKind(url: string, status: number, expectedKind: CloudFunctionError['kind'], done: DoneFn): void {
    http.get(url).subscribe({
      next: () => done.fail('expected error'),
      error: (err: CloudFunctionError) => {
        expect(err.kind).toBe(expectedKind);
        expect(err.status).toBe(status);
        expect(err.timestamp instanceof Date).toBeTrue();
        expect(err.original).toBeDefined();
        done();
      }
    });
    const req = httpMock.expectOne(url);
    if (status === 0) {
      req.error(new ErrorEvent('Network error'), { status: 0, statusText: 'Unknown Error' });
    } else {
      req.flush({ error: 'boom' }, { status, statusText: 'X' });
    }
  }

  it('classifies status 0 as network', (done) => {
    expectKind(targetUrl, 0, 'network', done);
  });

  it('classifies 401 as unauthorized', (done) => {
    expectKind(targetUrl, 401, 'unauthorized', done);
  });

  it('classifies 404 as not-found', (done) => {
    expectKind(targetUrl, 404, 'not-found', done);
  });

  it('classifies 500 as server', (done) => {
    expectKind(targetUrl, 500, 'server', done);
  });

  it('does not touch requests outside cloud functions base URL', (done) => {
    http.get(externalUrl).subscribe({
      next: () => done.fail('expected error'),
      error: (err) => {
        expect(err.kind).toBeUndefined();
        expect(err.status).toBe(500);
        done();
      }
    });
    httpMock.expectOne(externalUrl).flush({}, { status: 500, statusText: 'X' });
  });
});
