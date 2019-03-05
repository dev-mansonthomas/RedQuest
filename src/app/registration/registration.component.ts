import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CloudFunctionServiceService} from "../cloud-function-service.service";
import {ObserveOnMessage} from "rxjs/internal/operators/observeOn";
import {ULDetails} from "../model/ULDetails";
import {Observable} from "rxjs";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  uuid: string;
  ulDetails: ULDetails;

  constructor(private route: ActivatedRoute, private functions: CloudFunctionServiceService) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.uuid = queryParams.get('uuid');
      this.getULDetails(this.uuid)
        .subscribe(details => this.ulDetails = details);
    });
  }

  getULDetails(token: string): Observable<ULDetails> {
    return this.functions.findULDetailsByToken(token);
  }

  isBenevole1j() {
    return this.uuid === this.ulDetails.token_benevole_1j;
  }
}
