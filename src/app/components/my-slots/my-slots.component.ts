import {Component, OnInit} from '@angular/core';
import {Tronc} from '../../model/tronc';

export type TroncState = 'departure' | 'arrival';

@Component({
  selector: 'app-my-slots',
  templateUrl: './my-slots.component.html',
  styleUrls: ['./my-slots.component.css']
})
export class MySlotsComponent implements OnInit {

  registerState: TroncState = 'departure';

  constructor() {

  }

  ngOnInit() {

  }

  switchStateTo(state: TroncState) {
    console.log(state);
    this.registerState = state;
  }

  handleTroncDeparture(tronc: Tronc) {
    console.log(tronc);
  }

  handleTroncArrival(tronc: Tronc) {
    console.log(tronc);
  }

}
