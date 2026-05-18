import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { HistoriqueTroncQueteur } from '../../../model/historiqueTroncQueteur';
import { QueteurStats } from '../../../model/queteur-stats';
import { CloudFunctionService } from '../../../services/cloud-functions/cloud-function.service';

@Component({
  selector: 'app-queteur-history',
  templateUrl: './queteur-history.component.html',
  styleUrls: ['./queteur-history.component.css']
})
export class QueteurHistoryComponent implements OnInit {

  enabled = environment.history_enabled;
  statsTroncCurrentYear: HistoriqueTroncQueteur[] = [];

  data: QueteurStats[] = [];
  selectedYear: number;

  constructor(
    private route: ActivatedRoute,
    private cloudFunctions: CloudFunctionService) {
  }

  ngOnInit() {
    this.route.data.subscribe(() => this.retrieveStats());
    this.cloudFunctions.historiqueTroncQueteur$().subscribe(statsTQ => this.statsTroncCurrentYear = statsTQ);
  }

  private retrieveStats() {
    this.cloudFunctions.getQueteurStats$()
      .subscribe(rows => this.data = rows.filter(stat => stat.year !== new Date().getFullYear()));
  }

  selectYear(year: number) {
    if (this.selectedYear === year) {
      this.selectedYear = undefined;
    } else {
      this.selectedYear = year;
    }
  }
}
