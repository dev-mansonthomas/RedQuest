import {Component, Input, OnInit} from '@angular/core';
import {HistoriqueTroncQueteur} from '../../../model/historiqueTroncQueteur';
import { MatDialog } from '@angular/material/dialog';
import {TroncHistoryDialogComponent} from '../tronc-history-dialog/tronc-history-dialog.component';

@Component({
  selector: 'app-tronc-history',
  templateUrl: './tronc-history.component.html',
  styleUrls: ['./tronc-history.component.css']
})
export class TroncHistoryComponent implements OnInit {

  @Input() troncStat: HistoriqueTroncQueteur;
  @Input() troncIndex: number;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  seeMore() {
    this.dialog.open(TroncHistoryDialogComponent, {data: this.troncStat});
  }

}
