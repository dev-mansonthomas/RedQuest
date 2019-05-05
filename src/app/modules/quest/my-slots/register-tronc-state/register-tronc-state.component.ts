import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Tronc } from '../../../../model/tronc';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TroncState } from '../my-slots.component';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-register-tronc-state',
  templateUrl: './register-tronc-state.component.html',
  styleUrls: ['./register-tronc-state.component.css']
})
export class RegisterTroncStateComponent {

  @Output() refreshEvent = new EventEmitter<void>();
  @Output() troncUpdate = new EventEmitter<Tronc>();
  @Input() type: TroncState;
  @Input() troncs: Tronc[];

  @ViewChild(MatStepper) stepper: MatStepper;

  format = 'HH:mm [le] YYYY-MM-DD';
  isEditable = true;
  stepMinute = 15;
  now = new Date();

  //  selectedTronc: Tronc = Tronc.aTronc();

  errorMessage: string;

  step1Form: FormGroup;
  step2Form: FormGroup;

  get tronc() {
    return this.step1Form.get('tronc');
  }
  get startDate() {
    return this.step2Form.get('startDate');
  }

  @Input() confirmation: { error: boolean, message: string };
  private getRoundTime(m = 10, a = new Date().getTime()) {
    // get next time that is modulo 'm' (if it is 17h21 and m=10 -> returns 17h30)
    const mo = a % (m * 60 * 1000);
    const b = mo > 0 ? a - a % (m * 60 * 1000) + m * 60 * 1000 : a;
    return new Date(b);
  }
  constructor() {
    this.step1Form = new FormGroup({ 'tronc': new FormControl('', Validators.required) });
    this.step2Form = new FormGroup({ 'startDate': new FormControl('', Validators.required) });
  }

  refresh() {
    this.refreshEvent.emit();
    this.stepper.reset();
    //    this.selectedTronc = Tronc.aTronc();
  }

  getTroncs(): Tronc[] {
    if (this.type === 'departure') {
      return this.troncs.filter(tronc => tronc.depart === undefined);
    }
    return this.troncs.filter(tronc => tronc.depart && tronc.arrivee === undefined);
  }

  selectTronc() {
    this.step2Form = new FormGroup({
      'startDate': new FormControl(this.getRoundTime(this.stepMinute, this.minDep().getTime()), Validators.required)
    });
    this.stepper.next();
  }
  /*
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
  */
  minDep = () => this.step1Form.get('tronc').value ? new Date(this.type === 'departure' ?
    this.step1Form.get('tronc').value.depart_theorique :
    this.step1Form.get('tronc').value.depart) : new Date()


  updateTroncDate() {
    /* if (!this.validateTronc()) {
       return;
     }*/
    const selectedTronc = this.step1Form.getRawValue();
    if (selectedTronc.depart === undefined) {
      selectedTronc.depart = this.step2Form.get('startDate').value;
    } else {
      selectedTronc.arrivee = this.step2Form.get('startDate').value;
    }
    this.troncUpdate.emit(selectedTronc);
    this.isEditable = false;
    this.stepper.next();
  }
  /*
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
*/

  private isDeparture() {
    return this.type === 'departure';
  }

  getStepTitle() {
    return this.isDeparture() ? 'Départ' : 'Retour';
  }

  confirmationText() {
    /*
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
        */
  }
}
