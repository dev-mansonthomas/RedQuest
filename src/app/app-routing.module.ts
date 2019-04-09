import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RankingComponent} from './ranking/ranking.component';
import {AuthGuard} from './auth-guard';
import {HomepageComponent} from './homepage/homepage.component';
import {RegistrationComponent} from './registration/registration.component';
import {RegistrationConfirmationComponent} from './registration-confirmation/registration-confirmation.component';
import {QueteurHistoryComponent} from './queteur-history/queteur-history.component';
import {TipsComponent} from './tips/tips.component';
import {MyQuestComponent} from './my-quest/my-quest.component';

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
