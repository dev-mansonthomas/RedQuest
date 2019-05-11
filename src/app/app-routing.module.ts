import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './modules/login/login.component';
import {RankingComponent} from './components/ranking/ranking.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {TipsComponent} from './components/tips/tips.component';
import {AuthGuard} from './auth-guard';
import {QueteurResolverService} from './services/queteur/queteur.service';

const routes: Routes = [
  {path: '', component: HomepageComponent, canActivate: [AuthGuard], resolve: {queteur: QueteurResolverService}},
  {path: 'login', loadChildren: './modules/login/login.module#LoginModule'},
  {
    path: 'registration',
    loadChildren: './modules/registration/registration.module#RegistrationModule'
  },
  {
    path: 'quest', canActivate: [AuthGuard],
    loadChildren: './modules/quest/quest.module#QuestModule'
  },
  {path: 'tips', component: TipsComponent, canActivate: [AuthGuard]},
  {path: 'ranking', component: RankingComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
