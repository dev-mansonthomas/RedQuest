import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration-needed',
  templateUrl: './registration-needed.component.html',
  styles: [`
  h4, dt { font-size:2em !important; color: #f44336; font-weight: bold !important; padding:20px 0 10px;}
  mat-icon { font-size:1em !important; padding-right: 15px; }
  dd { font-size:15px; text-align:justify}
  sup { font-size:0.4em}
  `]
})
export class RegistrationNeededComponent {
  google = [{ a: 'G', c: '#4285F4' }, { a: 'o', c: '#DB4437' }, { a: 'o', c: '#F4B400' },
  { a: 'g', c: '#4285F4' }, { a: 'l', c: '#0F9D58' }, { a: 'e', c: '#DB4437' }];
}
