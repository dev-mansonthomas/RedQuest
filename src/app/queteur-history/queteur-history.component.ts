import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-queteur-history',
  templateUrl: './queteur-history.component.html',
  styleUrls: ['./queteur-history.component.css']
})
export class QueteurHistoryComponent implements OnInit {

  data = [
    {
      year: 2018,
      amount: 68.81,
      weight: 559.1,
      time: 91
    },
    {
      year: 2017,
      amount: 275.32,
      weight: 1899.66,
      time: 339
    }, {
      year: 2016,
      amount: 228.69,
      weight: 1692.26,
      time: 250
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
