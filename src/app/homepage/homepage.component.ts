import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  private connected: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.connected = this.authService.isLoggedIn()
  }

  logout() {
    this.authService.logout();
  }

}
