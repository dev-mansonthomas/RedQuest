import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/login/login.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TipsComponent } from './components/tips/tips.component';
import { RegisteredGuard } from './registered.guard';

const routes: Routes = [
  { path: '', component: HomepageComponent, canActivate: [RegisteredGuard] },
  {
    path: 'registration',
    loadChildren: './modules/registration/registration.module#RegistrationModule'
  }, {
    path: 'quest',
    loadChildren: './modules/quest/quest.module#QuestModule'
  }, {
    path: 'login',
    loadChildren: './modules/login/login.module#LoginModule'
  },
  { path: 'tips', component: TipsComponent, canActivate: [RegisteredGuard] },
  { path: 'ranking', component: RankingComponent, canActivate: [RegisteredGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
