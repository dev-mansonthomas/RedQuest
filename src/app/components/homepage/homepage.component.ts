import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth/auth.service';
import { QueteurService } from 'src/app/services/queteur/queteur.service';
import { MyLinks } from 'src/app/model/links';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  private connected: boolean;
  links = MyLinks;
  constructor(private authService: AuthService,
    private queteurService: QueteurService,
    private zone: NgZone,
    private router: Router) {
  }

  ngOnInit() {
    this.authService.onUserConnected().subscribe(user => this.connected = user != null);
    this.queteurService.getQueteur()
      .then(queteur => {
        if (queteur.registration_approved !== true) {
          this.zone.run(() => this.router.navigate(['registration/confirmation']));
        }
      })
      .catch(() => this.zone.run(() => this.router.navigate(['registration/needed'])));
  }

  logout() {
    this.authService.logout();
  }
}
