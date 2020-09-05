
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'src/app/shared.module';

import { LoginComponent } from './login.component';
import { LostPasswordDialogComponent } from './lostpassword.dialog.component';

const ROUTES: Routes = [
  { path: '', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(ROUTES)],
  declarations: [LoginComponent, LostPasswordDialogComponent]
})
export class LoginModule { }
