import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../firestore.service';
import {UlRankingByAmount} from '../model/UlRankingByAmount';
import {ActivatedRoute} from '@angular/router';
import {CloudFunctionServiceService} from '../cloud-function-service.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  rankings: UlRankingByAmount[] = [];

  constructor(private firestoreService: FirestoreService,
              private route: ActivatedRoute,
              private functionsService: CloudFunctionServiceService) {
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
    const data = {text: 'coucou le texte', firstNumber: 3, secondNumber: 4};
    this.functionsService.findQueteurById2(data);
  }

}
