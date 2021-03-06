import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Queteur } from 'src/app/model/queteur';

import { environment } from '../../../../environments/environment';
import { HistoriqueTroncQueteur } from '../../../model/historiqueTroncQueteur';
import { QueteurStats } from '../../../model/queteur-stats';
import { CloudFunctionService } from '../../../services/cloud-functions/cloud-function.service';
import { FirestoreService } from '../../../services/firestore/firestore.service';

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
    private firestoreService: FirestoreService,
    private cloudFunctions: CloudFunctionService) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { queteur: Queteur }) => this.retrieveStats(data.queteur.queteur_id));
    this.cloudFunctions.historiqueTroncQueteur$().subscribe(statsTQ => this.statsTroncCurrentYear = statsTQ);
  }

  private retrieveStats(queteurId: number) {
    this.firestoreService.getQueteurStats(queteurId)
      .subscribe(doc => {
        this.data = doc.docs
          .map(e => e.data() as QueteurStats)
          .filter(data => data.year !== new Date().getFullYear());
      });
  }

  selectYear(year: number) {
    if (this.selectedYear === year) {
      this.selectedYear = undefined;
    } else {
      this.selectedYear = year;
    }
  }
}
