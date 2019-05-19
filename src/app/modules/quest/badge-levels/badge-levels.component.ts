import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HistoriqueTroncQueteur} from '../../../model/historiqueTroncQueteur';

@Component({
  selector: 'app-badge-levels',
  templateUrl: './badge-levels.component.html',
  styleUrls: ['./badge-levels.component.scss']
})
export class BadgeLevelsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BadgeLevelsComponent>,
              @Inject(MAT_DIALOG_DATA) public badge: any) {
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
