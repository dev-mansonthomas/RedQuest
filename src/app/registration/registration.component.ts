import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CloudFunctionServiceService} from '../cloud-function-service.service';
import {ULDetails} from '../model/ULDetails';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {User} from '../model/user';
import {FirestoreService} from '../firestore.service';

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

  subscribed = false;
  user: firebase.User;

  registeredUser: User = User.aUser();

  email: string;
  password: string;

  userAuthId: string;

  constructor(private route: ActivatedRoute,
              private functions: CloudFunctionServiceService,
              private firestore: FirestoreService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.subscribed = false;
    this.route.queryParamMap.subscribe(queryParams => {
      this.uuid = queryParams.get('uuid');
      this.getULDetails(this.uuid)
        .subscribe(details => {
          this.ulDetails = details;
          this.updateUser();
        });
    });
    this.authService.getConnectedUser().subscribe(user => {
      if (user) {
        this.step = this.REGISTERING;
        this.user = user;
        this.registeredUser.email = this.user.email;
        this.userAuthId = user.uid;
      }
    });
  }

  private updateUser() {
    if (this.isBenevole1j()) {
      this.registeredUser.nivol = 'benevol1j';
    }
    this.registeredUser.ul_registration_token = this.uuid;
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
    this.authService.createUserWithEmaiPassword(this.email, this.password);
  }

  registerUser() {
    this.firestore.registerQueteur(this.userAuthId, this.registeredUser).then(doc => console.log(doc));
    this.functions.registerQueteur(this.registeredUser).subscribe(value => console.log(value));
  }
}
