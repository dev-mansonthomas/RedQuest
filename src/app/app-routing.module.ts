import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RankingComponent} from "./ranking/ranking.component";
import {AuthGuard} from "./auth-guard";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'ranking', component: RankingComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
