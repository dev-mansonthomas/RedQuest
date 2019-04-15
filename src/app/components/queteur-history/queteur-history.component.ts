import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../../services/firestore/firestore.service';
import {QueteurService} from '../../services/queteur/queteur.service';
import {QueteurStats} from '../../model/queteur-stats';

@Component({
  selector: 'app-queteur-history',
  templateUrl: './queteur-history.component.html',
  styleUrls: ['./queteur-history.component.css']
})
export class QueteurHistoryComponent implements OnInit {

  data: QueteurStats[];
  selectedYear: number;

  constructor(private firestoreService: FirestoreService,
              private queteurService: QueteurService) {
  }

  ngOnInit() {
    this.queteurService.getQueteur().then(queteur => this.retrieveStats(queteur.queteur_id));
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
