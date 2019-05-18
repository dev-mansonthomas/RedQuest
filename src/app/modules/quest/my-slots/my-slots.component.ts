import {Component, OnInit} from '@angular/core';

import {Tronc} from '../../../model/tronc';
import {CloudFunctionService} from '../../../services/cloud-functions/cloud-function.service';
import {QueteurService} from '../../../services/queteur/queteur.service';
import * as moment from 'moment-timezone';
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

  handleTroncDeparture(tronc: Tronc) {
    const update = {
      date: moment(tronc.depart).subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
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
      date: moment(tronc.arrivee).subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
      tqId: tronc.tronc_queteur_id,
      isDepart: false
    };
    this.cloudFunctions.troncStateUpdate(update);
  }

  getTroncsDeparture() {
    return this.troncs
      ? this.troncs.filter(tronc => tronc.depart === undefined
        || tronc.depart === null
        || tronc.depart.getFullYear() === 1970
      )
      : [];
  }

  getTroncsArrival(): Tronc[] {
    return this.troncs
      ? this.troncs.filter(
        tronc => (tronc.depart
          && tronc.depart.getFullYear() !== 1970)
          && (tronc.arrivee === undefined
            || tronc.arrivee === null
            || tronc.arrivee.getFullYear() === 1970)
      )
      : [];
  }

}
