import {Component, OnChanges, OnInit} from '@angular/core';
import {FirestoreRankingService} from "../firestore-ranking.service";
import {AuthService} from "../auth.service";
import {UlRankingByAmount} from "../model/UlRankingByAmount";
import {AuthGuard} from "../auth-guard";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  rankings: UlRankingByAmount[] = [];

  constructor(private firestoreRankingService: FirestoreRankingService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.getRanking())
  }


  private getRanking() {
    this.firestoreRankingService.getAllUlRankingByAmount()
      .subscribe(data => {
        this.rankings = data.map(e => {
          return e.payload.doc.data() as UlRankingByAmount
        });
      });
  }

}
