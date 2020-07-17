import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RankingComponent} from './components/ranking/ranking.component';
import {HomepageComponent} from './components/homepage/homepage.component';
import {TipsComponent} from './components/tips/tips.component';
import {AuthGuard} from './auth-guard';
import {QueteurResolverService} from './services/queteur/queteur.service';
import {CreditsComponent} from './components/credits/credits.component';
import {LocalUnitComponent} from './components/local-unit/local-unit.component';

const routes: Routes = [
  {path: '', component: HomepageComponent, canActivate: [AuthGuard], resolve: {queteur: QueteurResolverService}},
  {path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)},
  {
    path: 'registration',
    loadChildren: () => import('./modules/registration/registration.module').then(m => m.RegistrationModule)
  },
  {
    path: 'quest', canActivate: [AuthGuard],
    loadChildren: () => import('./modules/quest/quest.module').then(m => m.QuestModule)
  },
  {path: 'tips', component: TipsComponent, canActivate: [AuthGuard]},
  {path: 'ranking', component: RankingComponent, canActivate: [AuthGuard], resolve: {queteur: QueteurResolverService}},
  {path: 'credits', component: CreditsComponent, canActivate: [AuthGuard]},
  {path: 'local-unit', component: LocalUnitComponent, canActivate: [AuthGuard], resolve: {queteur: QueteurResolverService}},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
