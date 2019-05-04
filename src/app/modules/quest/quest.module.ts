
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { QueteurHistoryComponent } from './queteur-history/queteur-history.component';
import { MySlotsComponent } from './my-slots/my-slots.component';
import { MyDataComponent } from './my-data/my-data.component';
import { BadgesComponent } from './badges/badges.component';
import { RegisteredGuard } from 'src/app/registered.guard';
import { RegisterTroncStateComponent } from './my-slots/register-tronc-state/register-tronc-state.component';
import { SharedModule } from 'src/app/shared.module';
import { QuestPointComponent } from 'src/app/modules/quest/quest-point/quest-point.component';

const ROUTES: Routes = [
    { path: '', component: QueteurHistoryComponent, canActivate: [RegisteredGuard] },
    { path: 'slots', component: MySlotsComponent, canActivate: [RegisteredGuard] },
    { path: 'data', component: MyDataComponent, canActivate: [RegisteredGuard] },
    { path: 'badges', component: BadgesComponent, canActivate: [RegisteredGuard] },
    { path: 'quest-point', component: QuestPointComponent, canActivate: [RegisteredGuard] },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
        CommonModule, SharedModule, RouterModule.forChild(ROUTES)],
    declarations: [
        QueteurHistoryComponent, MySlotsComponent, MyDataComponent,
        BadgesComponent, RegisterTroncStateComponent, QuestPointComponent
    ]
})
export class QuestModule { }


