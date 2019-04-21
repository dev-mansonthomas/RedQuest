import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RankingComponent} from './components/ranking/ranking.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {RegistrationConfirmationComponent} from './components/registration-confirmation/registration-confirmation.component';
import {QueteurHistoryComponent} from './components/queteur-history/queteur-history.component';
import {TipsComponent} from './components/tips/tips.component';
import {RegistrationNeededComponent} from "./components/registration-needed/registration-needed.component";
import {RegisteredGuard} from "./registered.guard";
import {MySlotsComponent} from "./components/my-slots/my-slots.component";
import {MyDataComponent} from "./components/my-data/my-data.component";

const routes: Routes = [
  {path: '', redirectTo: '/homepage', pathMatch: 'full'},
  {path: 'homepage', component: HomepageComponent, canActivate: [RegisteredGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'registration-confirmation', component: RegistrationConfirmationComponent},
  {path: 'registration-needed', component: RegistrationNeededComponent},
  {path: 'tips', component: TipsComponent, canActivate: [RegisteredGuard]},
  {path: 'my-quest/history', component: QueteurHistoryComponent, canActivate: [RegisteredGuard]},
  {path: 'my-quest/my-slots', component: MySlotsComponent, canActivate: [RegisteredGuard]},
  {path: 'my-quest/my-data', component: MyDataComponent, canActivate: [RegisteredGuard]},
  {path: 'ranking', component: RankingComponent, canActivate: [RegisteredGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
