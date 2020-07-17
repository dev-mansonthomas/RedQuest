import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {HistoriqueTroncQueteur} from '../../../model/historiqueTroncQueteur';

@Component({
  selector: 'app-tronc-history-dialog',
  templateUrl: './tronc-history-dialog.component.html',
  styleUrls: ['./tronc-history-dialog.component.css']
})
export class TroncHistoryDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TroncHistoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public troncStat: HistoriqueTroncQueteur) { }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
