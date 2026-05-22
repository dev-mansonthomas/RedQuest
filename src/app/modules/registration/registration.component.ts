import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ULDetails } from '../../model/ULDetails';
import { Queteur } from '../../model/queteur';
import { AuthService } from '../../services/auth/auth.service';
import { CloudFunctionService } from '../../services/cloud-functions/cloud-function.service';
import { RegistrationError } from './registration-step-2/registration-step-2.component';

import firebase from 'firebase/app';
import 'firebase/auth';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../../../_social.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  UNKNOWN = 'unknown';
  REGISTERING = 'registering';

  step = this.UNKNOWN;

  uuid: string;
  ulDetails: ULDetails;

  hide1 = true;
  hide2 = true;
  user: firebase.User;

  createUserWithPasswordError:string;
  ulDetailsError: RegistrationError;
  readonly supportEmail = 'support.redcrossquest@croix-rouge.fr';

  registeredUser: Queteur = Queteur.aQueteur();

  loginForm: FormGroup;

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get confirmPassword() {
    return this.loginForm.get('confirmPassword');
  }

  userAuthId: string;

  private readonly destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute,
    private functions: CloudFunctionService,
    private router: Router,
    private zone: NgZone,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl('', Validators.required)
    }, [this.checkPasswords]);

    this.authService.onUserConnected().pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (!user) { return; }
      this.registeredUser = this.initUser();
      this.step = this.REGISTERING;
      this.user = user;
      this.registeredUser.email = this.user.email;
      this.userAuthId = user.uid;
      this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: { queteur: Queteur }) => {
        if (data.queteur) {
          this.zone.run(() => this.router.navigate(['registration/confirmation']));
        }
      });
    });

    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(queryParams => {
      this.uuid = queryParams.get('uuid');
      this.getULDetails(this.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          details => {
            this.ulDetails = details;
            this.ulDetailsError = undefined;
          },
          err => {
            this.ulDetailsError = {
              message: `Impossible de récupérer les informations de votre Unité Locale. Veuillez contacter le support : ${this.supportEmail}`,
              source: environment.cloudFunctionsNames.findULDetailsByToken,
              timestamp: new Date()
            };
            console.error('[registration:findULDetailsByToken]', err);
          }
        );
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initUser(): Queteur {
    const user = Queteur.aQueteur();
    if (this.isBenevole1j()) {
      user.nivol = 'benevol1j';
      user.secteur = 3;
    } else {
      user.secteur = 1;
    }
    user.ul_registration_token = this.uuid;
    return user;
  }

  getULDetails(token: string): Observable<ULDetails> {
    return this.functions.findULDetailsByToken$(token);
  }

  isBenevole1j() {
    return this.ulDetails && this.uuid === this.ulDetails.token_benevole_1j;
  }

  loginWithGoogle = () => this.authService.signInGoogleLogin();

  async signingUpWithEmailAndPassword()
  {
    if (this.loginForm.valid)
    {
      try
      {
        await this.authService.createUserWithEmailPassword(
            this.loginForm.get('email').value,
            this.loginForm.get('password').value
        );
      }
      catch(exception)
      {
        console.log("Error while creating user",exception);

        if(exception.code=='auth/email-already-in-use')
        {
          this.createUserWithPasswordError = "Un compte existe déjà avec cet email !";
        }
        else
        {
          this.createUserWithPasswordError = "Une erreur s'est produite : " + this.sanitizeAuthException(exception);
        }

      }

    }
  }

  private sanitizeAuthException(exception: any): string {
    if (!exception) { return 'erreur inconnue'; }
    const code = exception.code || '';
    const message = exception.message || '';
    const stackHead = typeof exception.stack === 'string'
      ? exception.stack.split('\n').slice(0, 2).join(' | ').slice(0, 200)
      : '';
    return [code, message, stackHead].filter(p => !!p).join(' — ');
  }

  private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true };
  }
}
