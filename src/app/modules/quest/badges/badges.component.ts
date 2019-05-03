import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent implements OnInit {

  badges = [
    { icon: 'fa-thumbs-up', label: '1ère quète', earned: true },
    { icon: 'fa-calendar', label: 'Calendrier', earned: true },
    { icon: 'fa-flag', label: 'Badge desc', earned: false },
    { icon: 'fa-comments', label: 'Badge desc', earned: true },
    { icon: 'fa-ambulance', label: 'Badge desc', earned: false },
    { icon: 'fa-comments', label: 'Badge desc', earned: false },
    { icon: 'fa-bone', label: 'Badge desc', earned: false },
    { icon: 'fa-coins', label: 'Badge desc', earned: true },
    { icon: 'fa-euro-sign', label: 'Badge desc', earned: false },
    { icon: 'fa-first-aid', label: 'Badge desc', earned: true },
    { icon: 'fa-first-aid', label: 'Badge desc', earned: false },
    { icon: 'fa-frog', label: 'Badge desc', earned: false },
    { icon: 'fa-hiking', label: 'Badge desc', earned: false },
    { icon: 'fa-hands-helping', label: 'Badge desc', earned: false },
    { icon: 'fa-igloo', label: 'Badge desc', earned: true },
    { icon: 'fa-tv', label: 'Badge desc', earned: false },
  ];
  constructor() { }

  ngOnInit() {
  }

}
