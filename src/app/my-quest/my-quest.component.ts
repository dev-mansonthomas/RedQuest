import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-my-quest',
  templateUrl: './my-quest.component.html',
  styleUrls: ['./my-quest.component.css']
})
export class MyQuestComponent implements OnInit {

  mySlotTab = 'Mes créneaux de quête';
  myDataTab = 'Mes données';
  myHistoryTab = 'Mon historique';

  tabs = [this.mySlotTab, this.myDataTab, this.myHistoryTab];
  activeTab = this.mySlotTab;

  constructor() {
  }

  ngOnInit() {
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

}
