import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-badge-levels',
  templateUrl: './badge-levels.component.html',
  styleUrls: ['./badge-levels.component.scss']
})
export class BadgeLevelsComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public badge: any) { }
}
