import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/services/auth/auth.service';
import { MyLinks } from 'src/app/model/links';
import { Queteur } from 'src/app/model/queteur';
import {CookieService} from 'ngx-cookie-service';
import {CloudFunctionService} from '../../services/cloud-functions/cloud-function.service';
import {ULPrefs} from '../../model/ULPrefs';
import {ULStats} from '../../model/ULStats';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  private connected: boolean;
  links = MyLinks;
  ulPrefs: ULPrefs = null;
  ulStats: ULStats = null;
  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private functionsService: CloudFunctionService,
    private zone: NgZone,
    private router: Router) {
  }

  ngOnInit() {
    this.cookieService.set('login-loading', 'false');
    this.authService.onUserConnected().subscribe(user => this.connected = user !== null);
    this.route.data.subscribe((data: { queteur: Queteur }) => {
      if (data.queteur.registration_approved !== true)
      {
        this.zone.run(() => this.router.navigate(['registration/confirmation']));
      }
      else
      {//TODO do only one call and subscribe to get the value
        this.functionsService.getULPrefs().subscribe(ulPrefs => this.ulPrefs = ulPrefs);
        this.functionsService.getULStats().subscribe(ulStats => this.ulStats = ulStats);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
