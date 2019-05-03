import { Component, OnInit } from '@angular/core';

import { AuthService } from './services/auth/auth.service';
import { QueteurService } from './services/queteur/queteur.service';
import { MyLinks, AllLinks } from './model/links';
import { Queteur } from './model/queteur';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  connected = false;
  authentified = false;
  myLinks = MyLinks;
  allLinks = AllLinks;
  env = environment;
  queteur: Queteur = null;
  constructor(
    private authService: AuthService,
    private queteurService: QueteurService) {
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(authentified => {
      this.authentified = authentified;
    });
    this.authService.onUserConnected().subscribe(user => {
      if (user) {
        this.queteurService.getQueteur()
          .then(q => {
            this.queteur = q;
            this.connected = true;
          })
          .catch(() => this.connected = false);
      } else {
        this.connected = false;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
