import { Component, OnInit } from '@angular/core';

import { Queteur } from 'src/app/model/queteur';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registration-confirmation',
  templateUrl: './registration-confirmation.component.html'
})
export class RegistrationConfirmationComponent implements OnInit {

  queteur: Queteur;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: { queteur: Queteur }) => this.queteur = data.queteur);
  }

  queteurRegistrationNotApprovedYet(): boolean {
    return this.queteur && this.queteur.registration_approved === null;
  }

  queteurRegistrationRefused() {
    return this.queteur && this.queteur.registration_approved === false;
  }

  queteurRegistrationNotRefused() {
    return this.queteur && this.queteur.registration_approved !== false;
  }

}
