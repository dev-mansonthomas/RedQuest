
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {AccountComponent} from './account.component';
import {SharedModule} from '../../shared.module';
import {QueteurResolverService} from '../../services/queteur/queteur.service';
import {AuthGuard} from '../../auth-guard';

const ROUTES: Routes = [
  { path: '', component: AccountComponent, resolve: { queteur: QueteurResolverService } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(ROUTES)],
  declarations: [AccountComponent]
})
export class AccountModule { }
