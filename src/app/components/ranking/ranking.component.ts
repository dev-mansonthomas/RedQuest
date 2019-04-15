import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../../services/firestore/firestore.service';
import {UlRankingByAmount} from '../../model/UlRankingByAmount';
import {ActivatedRoute} from '@angular/router';
import {CloudFunctionServiceService} from '../../services/cloud-functions/cloud-function-service.service';
import {QueteurService} from '../../services/queteur/queteur.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  page = 1;

  rankings: UlRankingByAmount[] = [];

  constructor(private firestoreService: FirestoreService,
              private route: ActivatedRoute,
              private functionsService: CloudFunctionServiceService,
              private queteurService: QueteurService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.getRanking());
  }


  private getRanking() {
    this.firestoreService.getAllUlRankingByAmount()
      .subscribe(doc => {
        this.rankings = doc.docs.map(e => {
          return e.data() as UlRankingByAmount;
        });
      });
  }

  callFunction() {
    this.queteurService.getQueteur().then(queteur => {
      const data = {id: queteur.queteur_id};
      this.functionsService.findQueteurById(data);
    });
  }

  onSorted(event: { sortColumn: string, sortDirection: 'asc' | 'desc' }) {
    if (event.sortColumn === 'name') {
      this.rankings.sort((rankA, rankB) => {
        const nameA = `${rankA.first_name.toLowerCase()} ${rankA.last_name.toLowerCase()}`;
        const nameB = `${rankB.first_name.toLowerCase()} ${rankB.last_name.toLowerCase()}`;
        if (nameA < nameB) //sort string ascending
          return event.sortDirection === 'asc' ? -1 : 1;
        if (nameA > nameB)
          return event.sortDirection === 'asc' ? 1 : -1;
        return 0; //default return value (no sorting)
      });
    }
    else {
      this.rankings.sort((rankA, rankB) => {
        return event.sortDirection === 'asc'
          ? rankA[event.sortColumn] - rankB[event.sortColumn]
          : rankB[event.sortColumn] - rankA[event.sortColumn];
      });
    }
  }

}
