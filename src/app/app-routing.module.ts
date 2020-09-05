import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth-guard';
import { CreditsComponent } from './components/credits/credits.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LocalUnitComponent } from './components/local-unit/local-unit.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { TipsComponent } from './components/tips/tips.component';
import { QueteurResolverService } from './services/queteur/queteur.service';

const routes: Routes = [
  { path: '', redirectTo: '/quest/badges', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent, canActivate: [AuthGuard], resolve: { queteur: QueteurResolverService } },
  { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) },
  {
    path: 'registration',
    loadChildren: () => import('./modules/registration/registration.module').then(m => m.RegistrationModule)
  },
  {
    path: 'quest', canActivate: [AuthGuard],
    loadChildren: () => import('./modules/quest/quest.module').then(m => m.QuestModule)
  },
  { path: 'tips', component: TipsComponent, canActivate: [AuthGuard] },
  { path: 'ranking', component: RankingComponent, canActivate: [AuthGuard], resolve: { queteur: QueteurResolverService } },
  { path: 'credits', component: CreditsComponent, canActivate: [AuthGuard] },
  { path: 'local-unit', component: LocalUnitComponent, canActivate: [AuthGuard], resolve: { queteur: QueteurResolverService } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
