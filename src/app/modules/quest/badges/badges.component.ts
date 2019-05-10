import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent implements OnInit {

  breakpoint: number;
  levels = [
    { name: 'A collecter', mult: 0 },
    { name: 'Bronze', mult: 1 },
    { name: 'Argent', mult: 2 },
    { name: 'Or', mult: 4 },
    { name: 'Rubis', mult: 8 }
  ];
  private lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor' +
    'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ' +
    'ullamco laboris nisi ut aliquip ex ea commodo consequat';
  badges = [
    { icon: 'fa-thumbs-up', name: '1ère quète', desc: '1ère quète', level: 1 },
    { icon: 'fa-calendar', name: 'Calendrier', desc: 'Calendrier', level: 2 },
    { icon: 'fa-flag', name: 'Nom du badge', desc: this.lorem, level: 0 },
    { icon: 'fa-comments', name: 'Nom du badge', desc: this.lorem, level: 1 },
    { icon: 'fa-ambulance', name: 'Nom du badge', desc: this.lorem, level: 3 },
    { icon: 'fa-comments', name: 'Nom du badge', desc: this.lorem, level: 4 },
    { icon: 'fa-bone', name: 'Nom du badge', desc: this.lorem, level: 4 },
    { icon: 'fa-coins', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', level: 1 },
    { icon: 'fa-euro-sign', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', level: 3 },
    { icon: 'fa-first-aid', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', level: 1 },
    { icon: 'fa-cat', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', level: 2 },
    { icon: 'fa-frog', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', level: 0 },
    { icon: 'fa-hiking', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', level: 2 },
    { icon: 'fa-hands-helping', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', level: 0 },
    { icon: 'fa-igloo', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', level: 1 },
    { icon: 'fa-tv', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', level: 2 },
  ];

  ngOnInit() { this.setCol(window.innerWidth); this.random(true); }
  setCol = (w: number) => this.breakpoint = (w <= 700) ? 1 : w <= 1000 ? 2 : 3;
  onResize = (event) => this.setCol(event.target.innerWidth);
  count = (level?: number) => this.badges.filter(d => typeof level === 'number' ? d.level === level : true).length;
  get score() {
    let p = 0;
    this.badges.forEach(b => p += this.levels[b.level].mult);
    return p;
  }
  private random = (reset = false) => {
    if (reset) {
      this.badges.forEach(b => b.level = 0);
    }
    const idx = Math.floor(Math.random() * this.badges.length)
    console.log(idx, this.score, this.badges.length * this.levels[this.levels.length - 1].mult);
    if (this.badges[idx].level < 4) {
      this.badges[idx].level++;
    } else if (this.score < this.badges.length * this.levels[this.levels.length - 1].mult) {
      this.random();
    }
    if (this.score < this.badges.length * this.levels[this.levels.length - 1].mult) {
      setTimeout(this.random, 500 + Math.random() * 1000);
    }
  }
}
