import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {QueteurHistoryComponent} from './queteur-history/queteur-history.component';
import {MySlotsComponent} from './my-slots/my-slots.component';
import {BadgesComponent} from './badges/badges.component';
import {RegisterTroncStateComponent} from './my-slots/register-tronc-state/register-tronc-state.component';
import {SharedModule} from 'src/app/shared.module';
import {QuestPointComponent} from 'src/app/modules/quest/quest-point/quest-point.component';
import {QueteurResolverService} from 'src/app/services/queteur/queteur.service';

const ROUTES: Routes = [
    { path: '', component: QueteurHistoryComponent, resolve: { queteur: QueteurResolverService } },
    { path: 'slots', component: MySlotsComponent, resolve: { queteur: QueteurResolverService } },
    { path: 'badges', component: BadgesComponent, resolve: { queteur: QueteurResolverService } },
    { path: 'quest-point', component: QuestPointComponent, resolve: { queteur: QueteurResolverService } },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
        CommonModule, SharedModule, RouterModule.forChild(ROUTES)],
    declarations: [
        QueteurHistoryComponent, MySlotsComponent,
        BadgesComponent, RegisterTroncStateComponent, QuestPointComponent
    ]
})
export class QuestModule { }


