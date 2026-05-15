import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from '../../../environments/environment';
import { AuthTokenInterceptor } from './auth-token.interceptor';

describe('AuthTokenInterceptor', () => {

  const baseUrl = environment.cloudFunctionsBaseUrl;
  const targetUrl = `${baseUrl}get-ul-prefs`;
  const externalUrl = 'https://maps.googleapis.com/maps/api/js';

  let http: HttpClient;
  let httpMock: HttpTestingController;
  let angularFireAuthStub: { currentUser: Promise<any> };

  function configure(currentUser: Promise<any>): void {
    angularFireAuthStub = { currentUser };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AngularFireAuth, useValue: angularFireAuthStub },
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('injects the Bearer token when the user is authenticated and the URL matches the cloud functions base URL', (done) => {
    const fakeToken = 'fake-id-token-123';
    const userStub = { getIdToken: jasmine.createSpy('getIdToken').and.returnValue(Promise.resolve(fakeToken)) };
    configure(Promise.resolve(userStub));

    http.get(targetUrl).subscribe(() => done());

    setTimeout(() => {
      const req = httpMock.expectOne(targetUrl);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
      expect(userStub.getIdToken).toHaveBeenCalled();
      req.flush({});
    }, 0);
  });

  it('does not inject any Authorization header when no user is currently signed in', (done) => {
    configure(Promise.resolve(null));

    http.get(targetUrl).subscribe(() => done());

    setTimeout(() => {
      const req = httpMock.expectOne(targetUrl);
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    }, 0);
  });

  it('does not touch requests sent to URLs outside the cloud functions base URL', (done) => {
    const userStub = { getIdToken: jasmine.createSpy('getIdToken').and.returnValue(Promise.resolve('should-not-be-used')) };
    configure(Promise.resolve(userStub));

    http.get(externalUrl).subscribe(() => done());

    const req = httpMock.expectOne(externalUrl);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    expect(userStub.getIdToken).not.toHaveBeenCalled();
    req.flush({});
  });
});
