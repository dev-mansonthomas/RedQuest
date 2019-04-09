import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../firestore.service';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.css']
})
export class MyDataComponent implements OnInit {

  mailto: string;
  ul_email = 'monul@croix-rouge.fr';

  constructor(private firestore: FirestoreService) {
  }

  ngOnInit() {
    this.firestore.getQueteur().then(queteur =>
      this.mailto = `mailto:${this.ul_email}?subject=[RedQuest, ID=${queteur.queteur_id}] Anonymiser mes données`
    );
  }

}
