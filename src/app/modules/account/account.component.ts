import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { ULDetails } from '../../model/ULDetails';
import { CloudFunctionService } from '../../services/cloud-functions/cloud-function.service';
import {Queteur} from '../../model/queteur';

@Component({
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
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

}
