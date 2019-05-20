import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';

import {Queteur} from 'src/app/model/queteur';
import {environment} from '../../../../environments/environment';
import {BadgesService} from './badges.service';
import {MatDialog} from '@angular/material';
import {BadgeLevelsComponent} from '../badge-levels/badge-levels.component';

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
      levelsDesc: {
        none: '0%',
        bronze: 'de 0 à 2%',
        argent: 'de 2 à 4%',
        or: 'de 4 à 8%',
        rubis: 'plus de 8%'
      },
      id: 'objective_percentage',
      more: '',
      level: 0
    },
    {
      icon: 'fas fa-calendar',
      name: 'Nombre de jours',
      desc: 'Quêter un maximum de jours.',
      levelsDesc: {
        none: 'si vous n\'avez pas quêté',
        bronze: 'de 1 à 4 jours',
        argent: 'de 4 à 7 jours',
        or: 'de 7 à 9 jours',
        rubis: 'tous les jours'
      },
      id: 'number_of_days',
      level: 0
    },
    {
      icon: 'fas fa-map-marked-alt',
      name: 'Nombre de lieux',
      desc: 'Quêter dans un maximum de points de quête distincts.',
      levelsDesc: {
        none: 'si vous n\'avez pas quêté',
        bronze: 'de 0 à 3 lieux (0 à 30% *)',
        argent: 'de 3 à 6 lieux (30 à 60% *)',
        or: 'de 6 à 10 lieux (60 à 80% *)',
        rubis: 'plus de 10 lieux (plus de 80% *)'
      },
      id: 'number_of_locations',
      more: '* si votre UL a moins de 10 points de quête, tenir compte des pourcentages.',
      level: 0
    },
    {
      icon: 'fas fa-running',
      name: 'Nombre de troncs',
      desc: 'Quêter un maximum de fois.',
      levelsDesc: {
        none: '0 ou 1 tronc',
        bronze: 'de 2 à 5 troncs',
        argent: 'de 5 à 10 troncs',
        or: 'de 10 à 20 troncs',
        rubis: 'plus de 20 troncs'
      },
      id: 'number_of_troncs',
      level: 0
    },
    {
      icon: 'fas fa-credit-card',
      name: 'Sans contact ?',
      desc: 'Quêter un maximum de fois par CB.',
      levelsDesc: {
        none: 'moins de 5€',
        bronze: 'de 5 à 100 €',
        argent: 'de 100 à 300€',
        or: 'de 300 à 500€',
        rubis: 'plus de 500€'
      },
      id: 'amount_cb',
      level: 0
    },
    {
      icon: 'fas fa-hourglass',
      name: 'Temps écoulé',
      desc: 'Quêter un maximum de temps.',
      levelsDesc: {
        none: 'moins d\'une heure',
        bronze: 'de 1 à 3h',
        argent: 'de 3 à 6h',
        or: 'de 6 à 12h',
        rubis: 'plus de 12h'
      },
      id: 'time_spent',
      level: 0
    },
    {
      icon: 'fas fa-weight-hanging',
      name: 'Poids',
      desc: 'Quêter le plus lourd possible.',
      levelsDesc: {
        none: 'moins de 600g',
        bronze: 'de 600g à 5kg',
        argent: 'de 5 à 15kg',
        or: 'de 15 à 30kg',
        rubis: 'plus de 30kg'
      },
      id: 'weight',
      level: 0
    }
  ];

  constructor(private route: ActivatedRoute,
              private badgesService: BadgesService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.setCol(window.innerWidth);
    this.route.data.subscribe((data: { queteur: Queteur }) => {
      this.queteur = data.queteur;
      this.badgesService.loadQueteurBadgesLevels(data.queteur.queteur_id)
        .subscribe(badges => {
          this.queteur.badges = [
            {id: 'number_of_days', level: badges.number_of_days.level, value: badges.number_of_days.value},
            {id: 'number_of_locations', level: badges.number_of_locations.level, value: badges.number_of_locations.value},
            {id: 'number_of_troncs', level: badges.number_of_troncs.level, value: badges.number_of_troncs.value},
            {id: 'amount_cb', level: badges.amount_cb.level, value: badges.amount_cb.value},
            {id: 'time_spent', level: badges.time_spent.level, value: badges.time_spent.value},
            {id: 'weight', level: badges.weight.level, value: badges.weight.value},
            {
              id: 'objective_percentage',
              level: badges.objective_percentage ? badges.objective_percentage.level : undefined,
              value: badges.objective_percentage ? badges.objective_percentage.value : undefined,
              more: badges.objective_percentage ? `L\'objectif de votre Unité Locale est de ${badges.objective_percentage.more}` : undefined
            }
          ];
          if (!badges.objective_percentage.level) {
            this.queteur.badges = this.queteur.badges.filter(badge => badge.id !== 'objective_percentage');
            this.badges = this.badges.filter(badge => badge.id !== 'objective_percentage');
          }
          console.log('badges:', badges);
          this.queteur.badges.forEach(b1 => setTimeout(() => {
            const badge = this.badges.find(b2 => b2.id === b1.id);
            badge.level = b1.level;
            badge['value'] = b1.value;
            if (b1.more) {
              badge.more = b1.more;
            }
          }, Math.random() * 2000 + 1000));
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

  setLevel(badge, level: number) {
    console.log('SetLevel', badge, level);
    badge.level++;
    if (badge.level < level) {
      setTimeout(this.setLevel, 1000, badge, level);
    }
  }

  private random(reset = false) {
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

  seeLevelsDetails(badge: any) {
    this.dialog.open(BadgeLevelsComponent, {data: badge});
  }
}
