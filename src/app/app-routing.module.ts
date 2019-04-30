import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './components/login/login.component';
import {RankingComponent} from './components/ranking/ranking.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {QueteurHistoryComponent} from './components/queteur-history/queteur-history.component';
import {TipsComponent} from './components/tips/tips.component';
import {RegisteredGuard} from './registered.guard';
import {MySlotsComponent} from './components/my-slots/my-slots.component';
import {MyDataComponent} from './components/my-data/my-data.component';
import {BadgesComponent} from './components/badges/badges.component';
import {QuestPointComponent} from './components/quest-point/quest-point.component';

const routes: Routes = [
  {path: '', redirectTo: '/homepage', pathMatch: 'full'},
  {
    path: 'registration',
    loadChildren: './modules/registration/registration.module#RegistrationModule'
  },
  {path: 'homepage', component: HomepageComponent, canActivate: [RegisteredGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'tips', component: TipsComponent, canActivate: [RegisteredGuard]},
  {path: 'my-quest/history', component: QueteurHistoryComponent, canActivate: [RegisteredGuard]},
  {path: 'my-quest/my-slots', component: MySlotsComponent, canActivate: [RegisteredGuard]},
  {path: 'my-quest/my-data', component: MyDataComponent, canActivate: [RegisteredGuard]},
  {path: 'my-quest/my-badges', component: BadgesComponent, canActivate: [RegisteredGuard]},
  {path: 'ranking', component: RankingComponent, canActivate: [RegisteredGuard]},
  {path: 'quest-point', component: QuestPointComponent, canActivate: [RegisteredGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
