import {AfterViewInit, Component, OnInit} from '@angular/core';

import {AuthService} from './services/auth/auth.service';
import {QueteurService} from './services/queteur/queteur.service';
import {AllLinks, MyLinks} from './model/links';
import {Queteur} from './model/queteur';
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    connected = false;
    authentified = false;
    myLinks = MyLinks;
    allLinks = AllLinks;
    env = environment;
    queteur: Queteur = null;

    constructor(
        private authService: AuthService,
        private queteurService: QueteurService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.authService.onUserConnected().subscribe(user => {
            this.authentified = user !== null;
        });
    }

    ngAfterViewInit(): void {
        this.queteurService.getQueteur()
            .subscribe(queteur => {
                this.handleQueteur(queteur);
            }, () => {
                if (window.location.pathname.indexOf('login') === -1 && window.location.pathname.indexOf('registration') === -1) {
                    this.router.navigate(['registration/needed']);
                }
            });
    }

    logout = () => {
        this.authentified = false;
        this.connected = false;
        this.authService.logout();
    };

    private handleQueteur(queteur: Queteur) {
        this.queteur = queteur;
        if (queteur.registration_approved) {
            this.connected = true;
        } else {
            this.router.navigate(['registration/confirmation']);
        }
    }


}
