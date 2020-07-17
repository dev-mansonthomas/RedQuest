import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';

import {Queteur} from 'src/app/model/queteur';
import {environment} from '../../../../environments/environment';
import {BadgesService} from './badges.service';
import { MatDialog } from '@angular/material/dialog';
import {BadgeLevelsComponent} from '../badge-levels/badge-levels.component';
import {ObjectivePercentageBadge} from '../../../model/badges/ObjectivePercentageBadge';
import {AmountCbBadge} from '../../../model/badges/AmountCbBadge';
import {NumberOfDaysBadge} from '../../../model/badges/NumberOfDaysBadge';
import {NumberOfLocationsBadge} from '../../../model/badges/NumberOfLocationsBadge';
import {NumberOfTroncsBadge} from '../../../model/badges/NumberOfTroncsBadge';
import {TimeSpentBadge} from '../../../model/badges/TimeSpentBadge';
import {WeightBadge} from '../../../model/badges/WeightBadge';

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
        new ObjectivePercentageBadge(),
        new AmountCbBadge(),
        new NumberOfDaysBadge(),
        new NumberOfLocationsBadge(),
        new NumberOfTroncsBadge(),
        new TimeSpentBadge(),
        new WeightBadge()
    ];

    constructor(private route: ActivatedRoute,
        private badgesService: BadgesService,
        private dialog: MatDialog) {
    }

    ngOnInit() {
        this.setCol(window.innerWidth);
        this.route.data.subscribe((data: { queteur: Queteur }) => {
            this.queteur = data.queteur;
            this.badgesService.loadQueteurBadgesLevels(this.badges, data.queteur.queteur_id)
                .subscribe(badges => this.badges = badges);
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

    seeLevelsDetails(badge: any) {
        this.dialog.open(BadgeLevelsComponent, {data: badge});
    }
}
