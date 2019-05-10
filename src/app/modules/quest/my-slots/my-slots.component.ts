import {Component, OnInit} from '@angular/core';

import {Tronc} from '../../../model/tronc';
import {CloudFunctionService} from '../../../services/cloud-functions/cloud-function.service';
import {QueteurUlInfoService} from '../../../services/queteur-ul-info/queteur-ul-info.service';

export type TroncState = 'departure' | 'arrival';

@Component({
  selector: 'app-my-slots',
  templateUrl: './my-slots.component.html'
})
export class MySlotsComponent implements OnInit {

  registerState: TroncState = 'departure';
  troncs: Tronc[];

  confirmation = {error: false, message: ''};

  slotsReadOnly = true;


  constructor(private cloudFunctions: CloudFunctionService,
              private queteurUlInfoService: QueteurUlInfoService) {
  }

  ngOnInit() {
    this.loadTroncs();
    this.queteurUlInfoService.isSlotsUpdateActivated()
      .subscribe(activated => this.slotsReadOnly = !activated);
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
      date: tronc.depart.toISOString().slice(0, 19).replace('T', ' '), // to format 'YYYY-MM-DD HH:mm:ss'
      tqId: tronc.tronc_queteur_id,
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
      date: tronc.arrivee.toISOString().slice(0, 19).replace('T', ' '), // to format 'YYYY-MM-DD HH:mm:ss'
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
