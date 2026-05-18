import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { ULPrefs } from './model/ULPrefs';
import { AllLinks, MyLinks } from './model/links';
import { Queteur } from './model/queteur';
import { AuthService } from './services/auth/auth.service';
import { CloudFunctionService } from './services/cloud-functions/cloud-function.service';
import { QueteurService } from './services/queteur/queteur.service';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  connected = false;
  authenticated = false;
  myLinks = MyLinks;
  allLinks = AllLinks;
  env = environment;
  queteur: Queteur = null;
  ulPrefs: ULPrefs = null;

  private lastFetchedUid: string;

  constructor(
    private authService: AuthService,
    private queteurService: QueteurService,
    private functionsService: CloudFunctionService,
    private cookieService: CookieService,
    private router: Router) {
  }

  ngOnInit(): void {
    // React to every authentication state change so the toolbar stays
    // in sync (initial load, login, logout, account switch).
    this.authService.onUserConnected().subscribe(user => {
      this.authenticated = user !== null;
      if (user) {
        if (this.lastFetchedUid !== user.uid) {
          this.lastFetchedUid = user.uid;
          this.loadQueteurAndPrefs();
        }
      } else {
        this.lastFetchedUid = undefined;
        this.queteur = null;
        this.ulPrefs = null;
        this.connected = false;
      }
    });
  }

  private loadQueteurAndPrefs(): void {
    this.queteurService.getQueteur()
      .subscribe(queteur => {
        this.handleQueteur(queteur);
        this.functionsService.getULPrefs$().subscribe(ulPrefs => this.ulPrefs = ulPrefs);
      }, () => {
        if (window.location.pathname.indexOf('login') === -1
            && window.location.pathname.indexOf('registration') === -1) {
          this.router.navigate(['registration/needed']);
        }
      });
  }

  logout = () => {
    this.cookieService.set('login-loading', 'false');
    this.authenticated = false;
    this.connected = false;
    this.authService.logout();
  }

  login = () => {
    this.cookieService.set('login-loading', 'false');
    this.router.navigate(['login']);
  }

  private handleQueteur(queteur: Queteur) {
    this.queteur = queteur;
    if (queteur.registration_approved) {
      this.connected = true;
    } else {
      this.router.navigate(['registration/confirmation']);
    }
  }
}
