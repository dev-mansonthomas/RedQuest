import {Component, OnInit} from '@angular/core';
import {Tronc} from '../../model/tronc';
import {CloudFunctionService} from '../../services/cloud-functions/cloud-function.service';

export type TroncState = 'departure' | 'arrival';

@Component({
  selector: 'app-my-slots',
  templateUrl: './my-slots.component.html',
  styleUrls: ['./my-slots.component.css']
})
export class MySlotsComponent implements OnInit {

  registerState: TroncState = 'departure';
  troncs: Tronc[];

  constructor(private cloudFunctions: CloudFunctionService) {
  }

  ngOnInit() {
    this.cloudFunctions.retrievePreparedTroncs().subscribe(troncs => {
      console.log(troncs);
      this.troncs = troncs;
    });
  }

  switchStateTo(state: TroncState) {
    this.registerState = state;
  }

  handleTroncDeparture(tronc: Tronc) {
    console.log(tronc);
  }

  handleTroncArrival(tronc: Tronc) {
    console.log(tronc);
  }

  getTroncsDeparture() {
    return this.troncs ? this.troncs.filter(tronc => tronc.depart === undefined) : [];
  }

  getTroncsArrival(): Tronc[] {
    return this.troncs ? this.troncs.filter(tronc => tronc.depart && tronc.arrivee === undefined) : [];
  }

}
