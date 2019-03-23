import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CloudFunctionServiceService} from '../cloud-function-service.service';
import {ULDetails} from '../model/ULDetails';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {User} from '../model/user';
import {FirestoreService} from '../firestore.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  UNKNOWN = 'unknown';
  REGISTERING = 'registering';

  step = this.UNKNOWN;

  uuid: string;
  ulDetails: ULDetails;

  user: firebase.User;

  registeredUser: User = User.aUser();

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
              private functions: CloudFunctionServiceService,
              private firestore: FirestoreService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
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
    this.authService.getConnectedUser().subscribe(user => {
      if (user) {
        this.registeredUser = this.initUser();
        this.step = this.REGISTERING;
        this.user = user;
        this.registeredUser.email = this.user.email;
        this.userAuthId = user.uid;
      }
    });
  }

  private initUser(): User {
    let user = User.aUser();
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

  loginWithGoogle() {
    this.authService.signInGoogleLogin();
  }

  loginWithTwitter() {
    this.authService.signInTwitterLogin();
  }

  loginWithFacebook() {
    this.authService.signInFacebookLogin();
  }

  signingUpWithEmailAndPassword() {
    if (this.loginForm.valid) {
      this.authService.createUserWithEmailPassword(this.loginForm.get('email').value, this.loginForm.get('password').value);
    }
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : {notSame: true}
  }
}
