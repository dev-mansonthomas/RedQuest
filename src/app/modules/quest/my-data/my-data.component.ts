import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Queteur } from 'src/app/model/queteur';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html'
})
export class MyDataComponent implements OnInit {

  mailto: string;
  ul_email = 'monul@croix-rouge.fr';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: { queteur: Queteur }) =>
      this.mailto = `mailto:${this.ul_email}?subject=[RedQuest, ID=${data.queteur.queteur_id}] Anonymiser mes données`)
  }
}
