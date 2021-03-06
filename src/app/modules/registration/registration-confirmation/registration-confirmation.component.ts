import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Queteur } from 'src/app/model/queteur';

import { ULDetails } from '../../../model/ULDetails';
import { CloudFunctionService } from '../../../services/cloud-functions/cloud-function.service';

@Component({
  selector: 'app-registration-confirmation',
  templateUrl: './registration-confirmation.component.html'
})
export class RegistrationConfirmationComponent implements OnInit {
  queteur: Queteur;
  ulDetails: ULDetails;

  constructor(private route: ActivatedRoute, private cloudFunctions: CloudFunctionService) { }

  ngOnInit() {
    this.route.data.subscribe((data: { queteur: Queteur }) => {
      this.queteur = data.queteur;
      this.cloudFunctions.findULDetailsByToken$(data.queteur.ul_registration_token)
        .subscribe(ulDetails => this.ulDetails = ulDetails);
    });
  }

  queteurRegistrationNotApprovedYet(): boolean {
    return this.queteur && this.queteur.registration_approved === null;
  }

  queteurRegistrationRefused() {
    return this.queteur && this.queteur.registration_approved === false;
  }
}
