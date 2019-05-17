import {Component, OnInit} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';

import {Queteur} from 'src/app/model/queteur';
import {environment} from '../../../../environments/environment';
import {CloudFunctionService} from '../../../services/cloud-functions/cloud-function.service';
import {BadgesService} from './badges.service';

const ze2 = [style({transform: 'translateX(-100%) rotateY(540deg)'}), animate(700)];

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss'],
  animations: [
    trigger('collect', [
      state('0', style({color: 'white'})),
      state('1', style({color: '#b4a996'})),
      state('2', style({color: '#d7d7d8'})),
      state('3', style({color: '#ecb731'})),
      state('4', style({color: '#ed1b2e'})),
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
    {name: 'A collecter', mult: 0},
    {name: 'Bronze', mult: 1},
    {name: 'Argent', mult: 2},
    {name: 'Or', mult: 4},
    {name: 'Rubis', mult: 8}
  ];

  badges = [
    {
      icon: 'fas fa-percentage',
      name: 'Objectif de l\'UL',
      desc: 'Participer à l\'objectif de l\'UL.',
      id: 'objective_percentage',
      level: 0
    },
    {icon: 'fas fa-calendar', name: 'Nombre de jours', desc: 'Quêter un maximum de jours.', id: 'number_of_days', level: 0},
    {
      icon: 'fas fa-map-marked-alt',
      name: 'Nombre de lieux',
      desc: 'Quêter dans un maximum de points de quête distincts.',
      id: 'number_of_locations',
      level: 0
    },
    {icon: 'fas fa-running', name: 'Nombre de troncs', desc: 'Quêter un maximum de fois.', id: 'number_of_troncs', level: 0},
    {icon: 'fas fa-credit-card', name: 'Sans contact ?', desc: 'Quêter un maximum de fois par CB.', id: 'amount_cb', level: 0},
    {icon: 'fas fa-hourglass', name: 'Temps écoulé', desc: 'Quêter un maximum de temps.', id: 'time_spent', level: 0},
    {icon: 'fas fa-weight-hanging', name: 'Poids', desc: 'Quêter le plus lourd possible.', id: 'weight', level: 0}
  ];

  constructor(private route: ActivatedRoute,
              private badgesService: BadgesService) {
  }

  ngOnInit() {
    this.setCol(window.innerWidth);
    this.route.data.subscribe((data: { queteur: Queteur }) => {
      this.queteur = data.queteur;
      this.badgesService.loadQueteurBadgesLevels(data.queteur.queteur_id)
        .subscribe(badges => {
          this.queteur.badges = [
            {id: 'number_of_days', level: badges.number_of_days},
            {id: 'number_of_locations', level: badges.number_of_locations},
            {id: 'number_of_troncs', level: badges.number_of_troncs},
            {id: 'amount_cb', level: badges.amount_cb},
            {id: 'time_spent', level: badges.time_spent},
            {id: 'weight', level: badges.weight},
            {id: 'objective_percentage', level: badges.objective_percentage}
          ];
          if (!badges.objective_percentage) {
            this.badges = this.badges.filter(badge => badge.id !== 'objective_percentage');
          }
          console.log('badges:', badges);
          this.queteur.badges.forEach(b1 => setTimeout(() =>
            this.badges.find(b2 => b2.id === b1.id).level = b1.level, Math.random() * 2000 + 1000));
        });
    });
  }

  setCol = (w: number) => this.breakpoint = (w <= 700) ? 1 : w <= 1000 ? 2 : 3;
  onResize = (event) => this.setCol(event.target.innerWidth);
  count = (level?: number) => this.badges.filter(d => typeof level === 'number' ? d.level === level : true).length;

  get score() {
    let p = 0;
    this.badges.forEach(b => {
      if (b.level) {
        p += this.levels[b.level].mult;
      }
    });
    return p;
  }

  setLevel = (badge, level: number) => {
    console.log('SetLevel', badge, level);
    badge.level++;
    if (badge.level < level) {
      setTimeout(this.setLevel, 1000, badge, level);
    }
  };

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
  };
}
