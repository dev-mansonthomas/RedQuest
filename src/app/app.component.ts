import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './services/auth/auth.service';
import {QueteurService} from "./services/queteur/queteur.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  connected = false;
  authentified = false;

  constructor(private router: Router,
              private authService: AuthService,
              private queteurService: QueteurService) {
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(() => this.authentified = true);
    this.authService.onUserConnected().subscribe(user => {
      if (user) {
        this.queteurService.getQueteur()
          .then(() => this.connected = true)
          .catch(() => this.connected = false);
      }
    });
  }

  logout() {
    this.authService.logout();
  }

}
