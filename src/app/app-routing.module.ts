import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RankingComponent} from './components/ranking/ranking.component';
import {AuthGuard} from './auth-guard';
import {HomepageComponent} from './components/homepage/homepage.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {RegistrationConfirmationComponent} from './components/registration-confirmation/registration-confirmation.component';
import {QueteurHistoryComponent} from './components/queteur-history/queteur-history.component';
import {TipsComponent} from './components/tips/tips.component';
import {MyQuestComponent} from './components/my-quest/my-quest.component';

const routes: Routes = [
  {path: '', redirectTo: '/homepage', pathMatch: 'full'},
  {path: 'homepage', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'registration-confirmation', component: RegistrationConfirmationComponent},
  {path: 'tips', component: TipsComponent, canActivate: [AuthGuard]},
  {path: 'my-quest', component: MyQuestComponent, canActivate: [AuthGuard]},
  {path: 'ranking', component: RankingComponent, canActivate: [AuthGuard]},
  {path: 'history', component: QueteurHistoryComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
