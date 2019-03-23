import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./auth.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  connected = false;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => this.connected = loggedIn);
  }

  logout() {
    this.authService.logout();
  }

  ngAfterViewInit(): void {
    $('[data-toggle="tooltip"]').tooltip()
  }


}
