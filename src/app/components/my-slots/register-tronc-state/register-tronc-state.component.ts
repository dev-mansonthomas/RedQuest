import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tronc} from '../../../model/tronc';
import * as moment from 'moment';
import Stepper from 'bs-stepper';
import {FormControl} from '@angular/forms';
import {TroncState} from '../my-slots.component';
import {Moment} from 'moment';

@Component({
  selector: 'app-register-tronc-state',
  templateUrl: './register-tronc-state.component.html',
  styleUrls: ['./register-tronc-state.component.css']
})
export class RegisterTroncStateComponent implements OnInit, AfterViewInit {

  troncs: Tronc[] = [
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 110
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 111
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 112
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 113
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 114
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 116
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 117
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 118
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 118
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 119
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 120
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 121,
      depart: moment().add(1, 'hour')
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 122,
      depart: moment().add(1, 'hour')
    },
    {
      queteur_id: 110,
      depart_theorique: moment(),
      tronc_id: 123,
      depart: moment(),
      arrivee: moment().add(1, 'hour')
    }
  ];

  @Output() troncUpdate = new EventEmitter<Tronc>();
  @Input() type: TroncState;

  format = 'HH:mm [le] YYYY-MM-DD';

  stepper: Stepper;

  selectedTronc: Tronc = {tronc_id: 0, depart_theorique: moment(), queteur_id: 0};

  errorMessage: string;

  dateForm = new FormControl(new Date());
  timeForm = new FormControl(new Date());
  dateTime: Moment;
  datePickerConfig = {
    containerClass: 'theme-default',
    dateInputFormat: '[le] DD-MM-YYYY [à] HH:mm'
  };

  constructor() {
  }

  ngAfterViewInit() {
    this.stepper = new Stepper(document.querySelector(`.${this.type}`), {
      linear: true,
      animation: true
    });
  }

  ngOnInit() {
    this.handleDateTime();
    this.timeForm.valueChanges.subscribe(() => {
      this.errorMessage = undefined;
      this.handleDateTime();
    });
    this.dateForm.valueChanges.subscribe(() => {
      this.errorMessage = undefined;
      this.handleDateTime();
    });
  }

  getTroncs(): Tronc[] {
    if (this.type === 'departure') {
      return this.troncs.filter(tronc => tronc.depart === undefined);
    }
    return this.troncs.filter(tronc => tronc.depart && tronc.arrivee === undefined);
  }

  selectTronc(tronc: Tronc) {
    if (this.type === 'departure') {
      this.dateForm.patchValue(tronc.depart_theorique.toDate());
      this.timeForm.patchValue(tronc.depart_theorique.toDate());
    } else {
      this.dateForm.patchValue(tronc.depart.toDate());
      this.timeForm.patchValue(tronc.depart.toDate());
    }
    this.selectedTronc = tronc;
    this.stepper.next();
  }

  goToSaveStep() {
    if (!this.validateTronc()) {
      if (this.type === 'departure') {
        this.errorMessage = 'La date de départ doit être ultérieure à la date de départ théorique.';
      } else {
        this.errorMessage = 'La date de retour doit être ultérieure à la date de départ.';
      }
      return;
    }
    this.stepper.next();
  }

  private handleDateTime() {
    const date = moment(this.dateForm.value);
    const time = moment(this.timeForm.value);
    this.dateTime = this.mergeDateAndTime(date, time);
  }

  private mergeDateAndTime(date, time) {
    return moment(date.format('YYYY-MM-DD') + ' ' + time.format('HH:mm'));
  }

  updateTroncDate() {
    if (!this.validateTronc()) {
      return;
    }
    if (this.selectedTronc.depart === undefined) {
      this.selectedTronc.depart = this.dateTime;
    } else {
      this.selectedTronc.arrivee = this.dateTime;
    }
    this.troncUpdate.emit(this.selectedTronc);
  }

  private validateTronc() {
    if (this.selectedTronc.depart) {
      return this.dateTime.isAfter(this.selectedTronc.depart); // registered return date is after departure date
    } else {
      return this.dateTime.isAfter(this.selectedTronc.depart_theorique); // registered departure date
    }
  }

  getTroncDisplay(tronc: Tronc) {
    if (tronc.depart) {
      return 'Tronc n°' + tronc.tronc_id + ' à ' + tronc.depart.format(this.format);
    }
    return 'Tronc n°' + tronc.tronc_id + ' à ' + tronc.depart_theorique.format(this.format);
  }

  getStepTitle() {
    return this.type === 'departure' ? 'Départ' : 'Retour';
  }

  getTypeText() {
    return this.type === 'departure' ? 'départ' : 'retour';
  }
}
