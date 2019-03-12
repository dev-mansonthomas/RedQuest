import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CloudFunctionServiceService} from '../cloud-function-service.service';
import {ObserveOnMessage} from 'rxjs/internal/operators/observeOn';
import {ULDetails} from '../model/ULDetails';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {User} from "../model/user";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  UNKNOWN = "unknown";
  REGISTERING = "registering";

  step = this.UNKNOWN;

  uuid: string;
  ulDetails: ULDetails;

  subscribed = false;
  user: firebase.User;

  registeredUser: User = User.aUser();

  email: string;
  password: string;

  constructor(private route: ActivatedRoute,
              private functions: CloudFunctionServiceService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.subscribed = false;
    this.route.queryParamMap.subscribe(queryParams => {
      this.uuid = queryParams.get('uuid');
      this.getULDetails(this.uuid)
        .subscribe(details => this.ulDetails = details);
    });
    this.authService.getEmailOfConnectedUser().subscribe(user => {
      if (user) {
        this.step = this.REGISTERING;
        this.user = user;
        this.registeredUser.email = this.user.email;
      }
    });
  }

  getULDetails(token: string): Observable<ULDetails> {
    return this.functions.findULDetailsByToken(token);
  }

  isBenevole1j() {
    return this.uuid === this.ulDetails.token_benevole_1j;
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
    this.authService.createUserWithEmaiPassword(this.email, this.password)
  }

  registerUser() {
    console.log(this.registeredUser);
  }
}
