import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

import { ULPrefs } from '../../model/ULPrefs';
import { ULStats } from '../../model/ULStats';
import { MyLinks } from '../../model/links';
import { Queteur } from '../../model/queteur';
import { AuthService } from '../../services/auth/auth.service';
import { CloudFunctionService } from '../../services/cloud-functions/cloud-function.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  private connected: boolean;

  links = MyLinks;
  ulPrefs$: Observable<ULPrefs>;
  ulStats$: Observable<ULStats>;

  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private functionsService: CloudFunctionService) {
  }

  queteur: Queteur;

  ngOnInit() {
    this.cookieService.set('login-loading', 'false');
    this.authService.onUserConnected().subscribe(user => this.connected = user !== null);
    this.route.data.subscribe((data: { queteur: Queteur }) => {
      this.queteur = data.queteur;
      this.ulPrefs$ = this.functionsService.getULPrefs$();
      this.ulStats$ = this.functionsService.getULStats$();
    });
  }

  logout() {
    this.authService.logout();
  }
}
