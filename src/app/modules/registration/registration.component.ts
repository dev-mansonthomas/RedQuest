import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';

import {CloudFunctionService} from 'src/app/services/cloud-functions/cloud-function.service';
import {ULDetails} from 'src/app/model/ULDetails';
import {AuthService} from 'src/app/services/auth/auth.service';
import {Queteur} from 'src/app/model/queteur';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../../../_social.scss']
})
export class RegistrationComponent implements OnInit {
  UNKNOWN = 'unknown';
  REGISTERING = 'registering';

  step = this.UNKNOWN;

  uuid: string;
  ulDetails: ULDetails;

  user: firebase.User;

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

  constructor(private route: ActivatedRoute,
              private functions: CloudFunctionService,
              private router: Router,
              private zone: NgZone,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.onUserConnected().subscribe(user => {
      if (user !== null) {
        this.route.data.subscribe((data: { queteur: Queteur }) => {
          if (data.queteur) {
            this.zone.run(() => this.router.navigate(['registration/confirmation']));
          }
        });
      }
    });
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required),
      'confirmPassword': new FormControl('', Validators.required)
    }, [this.checkPasswords]);


    this.route.queryParamMap.subscribe(queryParams => {
      this.uuid = queryParams.get('uuid');
      this.getULDetails(this.uuid)
        .subscribe(details => {
          this.ulDetails = details;
        });
    });


    this.authService.onUserConnected().subscribe(user => {
      if (user) {
        this.registeredUser = this.initUser();
        this.step = this.REGISTERING;
        this.user = user;
        this.registeredUser.email = this.user.email;
        this.userAuthId = user.uid;
      }
    });
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
    return this.functions.findULDetailsByToken(token);
  }

  isBenevole1j() {
    return this.ulDetails && this.uuid === this.ulDetails.token_benevole_1j;
  }

  loginWithGoogle = () => this.authService.signInGoogleLogin();

  loginWithFacebook = () => this.authService.signInFacebookLogin();


  signingUpWithEmailAndPassword() {
    if (this.loginForm.valid) {
      this.authService.createUserWithEmailPassword(this.loginForm.get('email').value, this.loginForm.get('password').value);
    }
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : {notSame: true};
  }
}
