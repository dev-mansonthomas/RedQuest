import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CloudFunctionServiceService} from '../cloud-function-service.service';
import {ObserveOnMessage} from 'rxjs/internal/operators/observeOn';
import {ULDetails} from '../model/ULDetails';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  uuid: string;
  ulDetails: ULDetails;

  subscribed = false;
  user: firebase.User;

  constructor(private route: ActivatedRoute,
              private functions: CloudFunctionServiceService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.uuid = queryParams.get('uuid');
      this.getULDetails(this.uuid)
        .subscribe(details => this.ulDetails = details);
    });
    this.authService.logout();
    this.authService.getEmailOfConnectedUser().subscribe(user => {
      if (user) {
        this.subscribed = true;
        this.user = user;
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
}
