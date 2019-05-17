import {Component, OnInit} from '@angular/core';

import {Tronc} from '../../../model/tronc';
import {CloudFunctionService} from '../../../services/cloud-functions/cloud-function.service';
import {QueteurService} from '../../../services/queteur/queteur.service';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';
import {Queteur} from '../../../model/queteur';

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

  ulWithSlotsEditable = [];


  constructor(private cloudFunctions: CloudFunctionService,
              private queteurService: QueteurService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loadTroncs();
    this.route.data.subscribe((data: { queteur: Queteur }) => {
      this.queteurService.isSlotsUpdateActivated()
        .subscribe(activated => this.slotsReadOnly = (!activated && this.ulWithSlotsEditable.indexOf(data.queteur.ul_id) === -1));
    });
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

  handleTroncDeparture(tronc: { tronc: Tronc }) {
    const update = {
      date: moment(tronc.tronc.depart).format('YYYY-MM-DD HH:mm:ss'),
      tqId: tronc.tronc.tronc_queteur_id,
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

  handleTroncArrival(tronc: { tronc: Tronc }) {
    const update = {
      date: moment(tronc.tronc.arrivee).format('YYYY-MM-DD HH:mm:ss'),
      tqId: tronc.tronc.tronc_id,
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
