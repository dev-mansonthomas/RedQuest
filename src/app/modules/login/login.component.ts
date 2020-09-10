import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { LostPasswordDialogComponent } from './lostpassword.dialog.component';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../_social.scss']
})
export class LoginComponent implements OnInit {

  loading = false;
  returnUrl: string;
  errorMessage: string;

  loginForm = new FormGroup({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', Validators.required)
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    private zone: NgZone,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl']  || '/';
    this.loading = this.cookieService.get('login-loading') === 'true';
    this.authService.onUserConnected().subscribe(user => {
      if (user) {
        this.zone.run(() => this.router.navigate(['/']));
      }
    });
  }

  openDialog = () => this.dialog.open(LostPasswordDialogComponent,
    { width: '450px', data: { email: this.email.value } })

  loginWithGoogle() {
    this.loading = true;
    this.cookieService.set('login-loading', 'true');
    this.authService.signInGoogleLogin()
      .then(() => {
        this.zone.run(() => this.router.navigate([this.returnUrl]));
      });
  }

  loginWithFacebook() {
    this.loading = true;
    this.cookieService.set('login-loading', 'true');
    this.authService.signInFacebookLogin().then(() => this.zone.run(() => this.router.navigate([this.returnUrl])));
  }

  loginWithEmailPassword() {
    this.authService.signInWithEmailPassword(this.email.value, this.password.value)
      .catch((error) => {
        this.handleEmailPasswordLoginError(error.code, error.message);
        throw error.message;
      })
      .then(() => this.zone.run(() => this.router.navigate([this.returnUrl])));
  }

  private handleEmailPasswordLoginError = (errorCode: string, errorMessage: string) => {
    this.errorMessage = errorMessage;
    console.error(`[LoginComponent] ${errorCode}: '${errorMessage}'`);
  }
}
