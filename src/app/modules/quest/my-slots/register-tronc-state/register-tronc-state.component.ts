import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Tronc} from '../../../../model/tronc';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TroncState} from '../my-slots.component';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'app-register-tronc-state',
  templateUrl: './register-tronc-state.component.html',
  styleUrls: ['./register-tronc-state.component.css']
})
export class RegisterTroncStateComponent {

  @Output() refreshEvent = new EventEmitter<void>();
  @Output() troncUpdate = new EventEmitter<Tronc>();
  @Input() readOnly: boolean;
  @Input() type: TroncState;
  @Input() troncs: Tronc[];

  @ViewChild(MatStepper) stepper: MatStepper;

  format = 'HH:mm [le] YYYY-MM-DD';
  isEditable = true;
  stepMinute = 15;
  now = new Date();

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
    this.step1Form = new FormGroup({'tronc': new FormControl('', Validators.required)});
    this.step2Form = new FormGroup({'startDate': new FormControl('', Validators.required)});
  }

  refresh() {
    this.refreshEvent.emit();
    this.stepper.reset();
  }

  selectTronc() {
    this.step2Form = new FormGroup({
      'startDate': new FormControl(this.getRoundTime(this.stepMinute, this.minDep().getTime()), Validators.required)
    });
    this.stepper.next();
  }

  minDep = () => this.step1Form.get('tronc').value ? new Date(this.type === 'departure' ?
    this.step1Form.get('tronc').value.depart_theorique :
    this.step1Form.get('tronc').value.depart) : new Date();

  updateTroncDate() {
    const selectedTronc = this.step1Form.getRawValue().tronc;
    if (this.type === 'departure') {
      selectedTronc.depart = this.step2Form.get('startDate').value;
    } else {
      selectedTronc.arrivee = this.step2Form.get('startDate').value;
    }
    this.troncUpdate.emit(selectedTronc);
    this.isEditable = false;
    this.stepper.next();
  }

  getStepTitle = () => this.type === 'departure' ? 'Départ' : 'Retour';
}
