import {Component, OnInit, ViewChildren} from '@angular/core';
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

  confirmation = {error: false, message: ''};

  @ViewChildren

  constructor(private cloudFunctions: CloudFunctionService) {
  }

  ngOnInit() {
    this.loadTroncs();
  }

  refresh() {
    this.loadTroncs();
  }

  loadTroncs() {
    this.cloudFunctions.retrievePreparedTroncs().subscribe(troncs => this.troncs = troncs);
  }

  switchStateTo(state: TroncState) {
    this.registerState = state;
  }

  handleTroncDeparture(tronc: Tronc) {
    const update = {
      date: tronc.depart.format('YYYY-MM-DD HH:mm:ss'),
      tqId: tronc.tronc_id,
      isDepart: true
    };
    this.cloudFunctions.troncStateUpdate(update).subscribe(
      next => {
        this.confirmation.message = 'C\'est validé!';
      },
      error => {
        this.confirmation.error = true;
        this.confirmation.message = 'Un problème est survenu lors de la mise à jour du tronc';
      });
  }

  handleTroncArrival(tronc: Tronc) {
    const update = {
      date: tronc.arrivee.format('YYYY-MM-DD HH:mm:ss'),
      tqId: tronc.tronc_id,
      isDepart: false
    };
    this.cloudFunctions.troncStateUpdate(update);
  }

  getTroncsDeparture() {
    return this.troncs ? this.troncs.filter(tronc => tronc.depart === undefined) : [];
  }

  getTroncsArrival(): Tronc[] {
    return this.troncs ? this.troncs.filter(tronc => tronc.depart && tronc.arrivee === undefined) : [];
  }

}
