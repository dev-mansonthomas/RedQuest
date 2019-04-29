import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tronc} from '../../../model/tronc';
import * as moment from 'moment';
import {Moment} from 'moment';
import Stepper from 'bs-stepper';
import {FormControl} from '@angular/forms';
import {TroncState} from '../my-slots.component';

@Component({
  selector: 'app-register-tronc-state',
  templateUrl: './register-tronc-state.component.html',
  styleUrls: ['./register-tronc-state.component.css']
})
export class RegisterTroncStateComponent implements OnInit, AfterViewInit {

  @Output() refreshEvent = new EventEmitter<void>();
  @Output() troncUpdate = new EventEmitter<Tronc>();
  @Input() type: TroncState;
  @Input() troncs: Tronc[];

  format = 'HH:mm [le] YYYY-MM-DD';

  stepper: Stepper;

  selectedTronc: Tronc = Tronc.aTronc();

  errorMessage: string;

  dateForm = new FormControl(new Date());
  timeForm = new FormControl(new Date());
  dateTime: Moment;
  datePickerConfig = {
    containerClass: 'theme-default',
    dateInputFormat: '[le] DD-MM-YYYY [à] HH:mm'
  };

  @Input() confirmation: { error: boolean, message: string };

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

  refresh() {
    this.refreshEvent.emit();
    this.stepper.to(0);
    this.selectedTronc = Tronc.aTronc();
  }

  getTroncs(): Tronc[] {
    if (this.type === 'departure') {
      return this.troncs.filter(tronc => tronc.depart === undefined);
    }
    return this.troncs.filter(tronc => tronc.depart && tronc.arrivee === undefined);
  }

  selectTronc(tronc: Tronc) {
    this.selectedTronc = {...tronc};
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
    this.stepper.next();
  }

  private validateTronc() {
    if (this.selectedTronc.depart) {
      return this.dateTime.isSameOrAfter(this.selectedTronc.depart); // registered return date is after departure date
    } else {
      return this.dateTime.isSameOrAfter(this.selectedTronc.depart_theorique); // registered departure date
    }
  }

  getTroncDisplay(tronc: Tronc) {
    if (tronc.depart) {
      return `id: ${tronc.tronc_queteur_id}
Tronc n° ${tronc.tronc_id}
Parti depuis le
${tronc.depart.format(this.format)}`;
    }
    return `id: ${tronc.tronc_queteur_id}
Tronc n° ${tronc.tronc_id}
Départ planifié à
${tronc.depart_theorique.format(this.format)}`;
  }

  private isDeparture() {
    return this.type === 'departure';
  }

  getStepTitle() {
    return this.isDeparture() ? 'Départ' : 'Retour';
  }

  confirmationText() {
    if (this.isDeparture()) {
      return `Enregistrer un départ
        du tronc n° ${this.selectedTronc.tronc_id}
        à ${this.dateTime.format(this.format)}
        à destination de "${this.selectedTronc.localization}"`;
    }
    return `Enregistrer un retour
        du tronc n° ${this.selectedTronc.tronc_id}
        à ${this.dateTime.format(this.format)}
        en provenance de "${this.selectedTronc.localization}"`;
  }
}
