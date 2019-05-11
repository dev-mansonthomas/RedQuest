import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {FirestoreService} from '../../../services/firestore/firestore.service';
import {QueteurStats} from '../../../model/queteur-stats';
import {Queteur} from 'src/app/model/queteur';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-queteur-history',
  templateUrl: './queteur-history.component.html'
})
export class QueteurHistoryComponent implements OnInit {

  enabled = environment.history_enabled;

  data: QueteurStats[];
  selectedYear: number;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { queteur: Queteur }) => this.retrieveStats(data.queteur.queteur_id));
  }

  private retrieveStats(queteurId) {
    this.firestoreService.getQueteurStats(queteurId).subscribe(doc => {
      this.data = doc.docs.map(e => {
        return e.data() as QueteurStats;
      });
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
