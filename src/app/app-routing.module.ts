import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RankingComponent} from './components/ranking/ranking.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {TipsComponent} from './components/tips/tips.component';
import {AuthGuard} from './auth-guard';
import {QueteurResolverService} from './services/queteur/queteur.service';
import {LocalUnitComponent} from './components/local-unit/local-unit.component';

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
  {path: 'ranking', component: RankingComponent, canActivate: [AuthGuard], resolve: {queteur: QueteurResolverService}},
  {path: 'local-unit', component: LocalUnitComponent, canActivate: [AuthGuard], resolve: {queteur: QueteurResolverService}},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
