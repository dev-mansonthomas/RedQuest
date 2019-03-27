import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FirestoreService} from '../firestore.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  private connected: boolean;

  constructor(private authService: AuthService,
              private firestore: FirestoreService,
              private zone: NgZone,
              private router: Router) { }

  ngOnInit() {
    this.authService.onUserConnected().subscribe(user => {
      this.connected = user != null;
      if (user != null) {
        this.firestore.getQueteur(user.uid).then(queteur => {
          if (queteur.registration_approved !== true) {
            this.zone.run(() => this.router.navigate(['registration-confirmation']));
          }
        });
      }
    });
  }

  logout() {
    this.authService.logout();
  }

}
