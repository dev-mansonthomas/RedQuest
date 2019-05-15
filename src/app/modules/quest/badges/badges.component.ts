import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

import { Queteur } from 'src/app/model/queteur';
import { environment } from '../../../../environments/environment';

// const ze = style({ transform: 'rotate3d(1, 2, -1, 192deg)' });
const ze2 = [style({ transform: 'translateX(-100%) rotateY(540deg)' }), animate(700)];
@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss'],
  animations: [
    trigger('collect', [
      state('0', style({ color: 'white' })),
      state('1', style({ color: '#b4a996' })),
      state('2', style({ color: '#d7d7d8' })),
      state('3', style({ color: '#ecb731' })),
      state('4', style({ color: '#ed1b2e' })),
      transition('0 => *', ze2), transition('1 => *', ze2),
      transition('2 => *', ze2), transition('3 => *', ze2),
    ])
  ]
})
export class BadgesComponent implements OnInit {

  enabled = environment.badges_enabled;
  queteur: Queteur;
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
    { icon: 'fa-thumbs-up', name: '1ère quète', desc: '1ère quète', id: 'badge01', level: 0 },
    { icon: 'fa-calendar', name: 'Calendrier', desc: 'Calendrier', id: 'badge02', level: 0 },
    { icon: 'fa-flag', name: 'Nom du badge', desc: this.lorem, id: 'badge03', level: 0 },
    { icon: 'fa-comments', name: 'Nom du badge', desc: this.lorem, id: 'badge04', level: 0 },
    { icon: 'fa-ambulance', name: 'Nom du badge', desc: this.lorem, id: 'badge05', level: 0 },
    { icon: 'fa-comments', name: 'Nom du badge', desc: this.lorem, id: 'badge06', level: 0 },
    { icon: 'fa-bone', name: 'Nom du badge', desc: this.lorem, id: 'badge07', level: 0 },
    { icon: 'fa-coins', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', id: 'badge08', level: 0 },
    { icon: 'fa-euro-sign', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', id: 'badge09', level: 0 },
    { icon: 'fa-first-aid', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', id: 'badge10', level: 0 },
    { icon: 'fa-cat', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', id: 'badge11', level: 0 },
    { icon: 'fa-frog', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', id: 'badge12', level: 0 },
    { icon: 'fa-hiking', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', id: 'badge13', level: 0 },
    { icon: 'fa-hands-helping', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', id: 'badge14', level: 0 },
    { icon: 'fa-igloo', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', id: 'badge15', level: 0 },
    { icon: 'fa-tv', name: 'Nom du badge', desc: 'Voici comment obtenir ce badge...', id: 'badge16', level: 0 },
  ];
  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
    this.setCol(window.innerWidth);
    // this.random(true);
    this.route.data.subscribe((data: { queteur: Queteur }) => {
      this.queteur = data.queteur;
      this.queteur.badges = [
        { id: 'badge01', level: 3 },
        { id: 'badge02', level: 1 },
        { id: 'badge03', level: 4 },
        { id: 'badge05', level: 2 }];

      this.queteur.badges.forEach(b1 => setTimeout(() =>
        this.badges.find(b2 => b2.id === b1.id).level = b1.level, Math.random() * 2000 + 1000));
      /// this.queteur.badges.forEach(b1 => setTimeout(this.setLevel, 6000, this.badges.find(b2 => b2.id === b1.id), b1.level));
      console.log('QUETEZUR badsge', data);
    });
  }

  setCol = (w: number) => this.breakpoint = (w <= 700) ? 1 : w <= 1000 ? 2 : 3;
  onResize = (event) => this.setCol(event.target.innerWidth);
  count = (level?: number) => this.badges.filter(d => typeof level === 'number' ? d.level === level : true).length;

  get score() {
    let p = 0;
    console.log('Score', JSON.stringify(this.levels), this.badges);
    this.badges.forEach(b => p += this.levels[b.level].mult);
    return p;
  }
  setLevel = (badge, level: number) => {
    console.log('SetLevel', badge, level);
    badge.level++;
    if (badge.level < level) {
      setTimeout(this.setLevel, 1000, badge, level);
    }
  }
  private random = (reset = false) => {
    if (reset) {
      this.badges.forEach(b => b.level = 0);
    }
    const idx = Math.floor(Math.random() * this.badges.length);
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
