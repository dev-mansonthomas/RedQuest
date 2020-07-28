import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/services/auth/auth.service';
import { MyLinks } from 'src/app/model/links';
import { Queteur } from 'src/app/model/queteur';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  private connected: boolean;
  links = MyLinks;
  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private zone: NgZone,
    private router: Router) {
  }

  ngOnInit() {
    this.cookieService.set('login-loading', 'false');
    this.authService.onUserConnected().subscribe(user => this.connected = user !== null);
    this.route.data.subscribe((data: { queteur: Queteur }) => {
      if (data.queteur.registration_approved !== true) {
        this.zone.run(() => this.router.navigate(['registration/confirmation']));
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
