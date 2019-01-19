import {Component, OnInit} from '@angular/core';
import {FirestoreRankingService} from "./firestore-ranking.service";
import {UlRankingByAmount} from "./model/UlRankingByAmount";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  rankings: UlRankingByAmount[] = [];

  constructor(private firestoreRankingService: FirestoreRankingService) {

  }

  ngOnInit(): void {
    this.firestoreRankingService.getAllUlRankingByAmount()
      .subscribe(data => {
        this.rankings = data.map(e => {
          return e.payload.doc.data() as UlRankingByAmount
        });
        console.log(this.rankings);
      });
  }
}
