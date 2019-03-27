import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  returnUrl: string;

  email: string;
  password: string;

  resetPasswordEmailSent: boolean = false;
  errorMessage: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.authService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  loginWithGoogle() {
    this.loading = true;
    this.authService.signInGoogleLogin().then(() => this.zone.run(() => this.router.navigate([this.returnUrl])));
  }

  loginWithTwitter() {
    this.authService.signInTwitterLogin().then(() => this.zone.run(() => this.router.navigate([this.returnUrl])));
  }

  loginWithFacebook() {
    this.authService.signInFacebookLogin().then(() => this.zone.run(() => this.router.navigate([this.returnUrl])));
  }

  loginWithEmailPassword() {
    this.authService.signInWithEmailPassword(this.email, this.password)
      .catch((error) => {
        this.handleEmailPasswordLoginError(error.code, error.message);
        throw error.message;
      })
      .then(() => this.zone.run(() => this.router.navigate([this.returnUrl])));
  }

  handleEmailPasswordLoginError(errorCode, errorMessage) {
    console.log(errorCode);
    console.log(errorMessage);
  }

  sendResetPwdEmail(email: string) {
    this.errorMessage = '';
    this.resetPasswordEmailSent = false;
    this.authService.sendResetPasswordEmail(email)
      .then(() => this.resetPasswordEmailSent = true)
      .catch(error => {
        console.log(error);
        this.errorMessage = this.authService.handleAuthError(error);
      });
  }

}
