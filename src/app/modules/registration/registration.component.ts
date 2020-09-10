import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { ULDetails } from '../../model/ULDetails';
import { Queteur } from '../../model/queteur';
import { AuthService } from '../../services/auth/auth.service';
import { CloudFunctionService } from '../../services/cloud-functions/cloud-function.service';

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

  hide1 = true;
  hide2 = true;
  user: firebase.User;

  createUserWithPasswordError:string;

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
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
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
    return this.functions.findULDetailsByToken$(token);
  }

  isBenevole1j() {
    return this.ulDetails && this.uuid === this.ulDetails.token_benevole_1j;
  }

  loginWithGoogle = () => this.authService.signInGoogleLogin();

  loginWithFacebook = () => this.authService.signInFacebookLogin();


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
          this.createUserWithPasswordError = "Une erreur s'est produite : "+JSON.stringify(exception);
        }

      }

    }
  }

  private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true };
  }
}
