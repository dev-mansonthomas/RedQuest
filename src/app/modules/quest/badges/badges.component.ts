import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent implements OnInit {

  badges = [
    { icon: 'fa-thumbs-up', label: '1ère quète', level: 1 },
    { icon: 'fa-calendar', label: 'Calendrier', level: 2 },
    { icon: 'fa-flag', label: 'Badge desc', level: 0 },
    { icon: 'fa-comments', label: 'Badge desc', level: 1 },
    { icon: 'fa-ambulance', label: 'Badge desc', level: 3 },
    { icon: 'fa-comments', label: 'Badge desc', level: 0 },
    { icon: 'fa-bone', label: 'Badge desc', level: 0 },
    { icon: 'fa-coins', label: 'Badge desc', level: 1 },
    { icon: 'fa-euro-sign', label: 'Badge desc', level: 3 },
    { icon: 'fa-first-aid', label: 'Badge desc', level: 1 },
    { icon: 'fa-first-aid', label: 'Badge desc', level: 2 },
    { icon: 'fa-frog', label: 'Badge desc', level: 0 },
    { icon: 'fa-hiking', label: 'Badge desc', level: 0 },
    { icon: 'fa-hands-helping', label: 'Badge desc', level: 0 },
    { icon: 'fa-igloo', label: 'Badge desc', level: 1 },
    { icon: 'fa-tv', label: 'Badge desc', level: 2 },
  ];
  constructor() { }

  ngOnInit() {
  }

}
