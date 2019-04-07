import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RankingComponent} from './ranking/ranking.component';
import {AuthGuard} from './auth-guard';
import {HomepageComponent} from './homepage/homepage.component';
import {RegistrationComponent} from './registration/registration.component';
import {RegistrationConfirmationComponent} from './registration-confirmation/registration-confirmation.component';
import {QueteurHistoryComponent} from "./queteur-history/queteur-history.component";

const routes: Routes = [
  {path: '', redirectTo: '/homepage', pathMatch: 'full'},
  {path: 'homepage', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'ranking', component: RankingComponent, canActivate: [AuthGuard]},
  {path: 'history', component: QueteurHistoryComponent, canActivate: [AuthGuard]},
  {path: 'registration', component: RegistrationComponent},
  {path: 'registration-confirmation', component: RegistrationConfirmationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
